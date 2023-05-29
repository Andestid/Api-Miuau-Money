const router = require('express').Router();
const User = require('../models/user');
const PDFDocument = require('pdfkit');
const fs = require('fs');

router.get('/', (req, res) => {
    res.json({
        error:null,
        data: {
            titulo: "BIENVENIDO A MIAU MONEY",
            user: req.user
        }
    })
})

router.post('/presupuesto', async (req, res) => {
    try {
      console.log(req.user.name);
  
      // Obtener el usuario por su correo electrónico
      const usuario = await User.findOne({ email: req.body.email });
  
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
  
      const ingresos = parseFloat(req.body.ingresos);
      const egresos = parseFloat(req.body.egresos);
      const ie = ingresos - egresos;
  
      // Actualizar los valores del usuario
      usuario.moneysobrante += ie;
      usuario.moneygasto += egresos;
      usuario.moneytotal += ingresos;
  
      // Guardar los cambios en la base de datos
      await usuario.save();
  
      res.json({
        error: null,
        data: {
          user: usuario
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al actualizar el presupuesto',
        message: error.message
      });
    }
  });
  
  router.post('/generar-pdf', async (req, res) => {
    try {
      const { email } = req.body;
  
      // Buscar el usuario por su correo electrónico
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Crear un nuevo documento PDF
      const doc = new PDFDocument();
  
      // Definir el nombre del archivo de salida
      const fileName = `${user.name}_info.pdf`;
  
      // Adjuntar el archivo PDF en la respuesta
      res.attachment(fileName);
  
      // Establecer el flujo de escritura para la respuesta
      doc.pipe(res);
  
      // Establecer el título del documento
      doc.fontSize(20).text('Información del Usuario', { align: 'center' });
  
      // Agregar los datos del usuario al documento
      doc.fontSize(12).text(`Nombre: ${user.name}`);
      doc.fontSize(12).text(`Email: ${user.email}`);
      doc.fontSize(12).text(`Total: ${user.moneytotal}`);
      doc.fontSize(12).text(`Gasto: ${user.moneygasto}`);
      doc.fontSize(12).text(`Sobrante: ${user.moneysobrante}`);
  
      // Finalizar el documento
      doc.end();
  
      console.log(`PDF generado: ${fileName}`);
  
    } catch (error) {
      console.error('Error al generar el PDF:', error.message);
      res.status(500).json({ error: 'Error al generar el PDF' });
    }
  });

module.exports = router;