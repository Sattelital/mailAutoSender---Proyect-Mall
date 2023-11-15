import nodemailer from 'nodemailer';
import fs from 'fs';


// Configura el transporte de correo
const transporter = nodemailer.createTransport({
    host: "mail.globalfiber.com.pe",
    port: 465,
    // secure: true, // use TLS
    auth: {
        user: 'proyectos.ti@globalfiber.com.pe',
        pass: '@@20#$%ProYectos@23#$#',
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});

setInterval(() => {
    const db = fs.readFileSync('./db.json', 'utf-8');
    if (db) {
        const dbTime = JSON.parse(db)

        // Obtén la fecha de hoy
        const fechaHoy = new Date();
        // Obtén la fecha de ayer restando un día a la fecha de hoy
        const fechaAyer = new Date();
        fechaAyer.setDate(fechaHoy.getDate() - 1);

        // Formatea las fechas como cadenas en el formato que desees
        const formatoFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };

        const fechaHoyFormateada = fechaHoy.toLocaleDateString('es-ES', formatoFecha);
        const fechaAyerFormateada = fechaAyer.toLocaleDateString('es-ES', formatoFecha);

        // Enviar archivo diariamente
        if (dbTime.year === fechaHoy.getFullYear() && dbTime.month === fechaHoy.getMonth() + 1 && dbTime.day === fechaHoy.getDate()) {
            // console.log('Ya se envió el archivo el día de hoy');
        } else {
            console.log(`Se envió el archivo diario ${fechaHoyFormateada} - ${fechaHoy.getHours() + ':' + fechaHoy.getMinutes() + ':' + fechaHoy.getSeconds()}`);
            // sendEmail(from, to, cc, bcc, subject, content, htmlTemplate)
            sendEmail('Proyectos TI - GLOBAL FIBER <proyectos.ti@globalfiber.com.pe>', ['WiFi MA <wifi.ma@aventura-adm.com>'], ['Carlos Cabello <carlos.cabello@globalfiber.com.pe>'], ['Edward Espinoza <edward.espinoza@globalfiber.com.pe>'], 'REPORTE DE REGISTROS DIARIO', { dia: fechaAyerFormateada, linkDeDescarga: `http://metricas.globalfiber.com.pe:3000/repo/mall/data?year=${fechaAyer.getFullYear()}&month=${fechaAyer.getMonth() + 1}&day=${fechaAyer.getDate()}` }, './templates/mailToMallDiario.html')

            // sendEmail('Proyectos TI - GLOBAL FIBER <proyectos.ti@globalfiber.com.pe>', ['Edward Espinoza <edward.espinoza@globalfiber.com.pe>'], [], [], 'REPORTE DE REGISTROS DIARIO', { dia: fechaAyerFormateada, linkDeDescarga: `http://metricas.globalfiber.com.pe:3000/repo/mall/data?year=${fechaAyer.getFullYear()}&month=${fechaAyer.getMonth() + 1}&day=${fechaAyer.getDate()}` }, './templates/mailToMallDiario.html')
        }

        const mesAnterior = new Date();
        mesAnterior.setMonth(mesAnterior.getMonth() - 1);
        const formatoMes = { year: 'numeric', month: '2-digit' };
        const mesAnteriorFormateado = mesAnterior.toLocaleDateString('es-ES', formatoMes);
        // Enviar archivos mensualmente
        if (dbTime.year === fechaHoy.getFullYear() && dbTime.month === fechaHoy.getMonth() + 1) {
            // console.log('Ya se envió el archivo de este mes');
        } else {
            console.log(`Se envió el archivo mensual ${fechaHoyFormateada} - ${fechaHoy.getHours() + ':' + fechaHoy.getMinutes() + ':' + fechaHoy.getSeconds()}`);
            // sendEmail(from, to, cc, bcc, subject, content)
            sendEmail('Proyectos TI - GLOBAL FIBER <proyectos.ti@globalfiber.com.pe>', ['WiFi MA <wifi.ma@aventura-adm.com>'], ['Carlos Cabello <carlos.cabello@globalfiber.com.pe>'], ['Edward Espinoza <edward.espinoza@globalfiber.com.pe>'], 'REPORTE DE REGISTROS MENSUAL', { dia: mesAnteriorFormateado, linkDeDescarga: `http://metricas.globalfiber.com.pe:3000/repo/mall/data?year=${mesAnterior.getFullYear()}&month=${mesAnterior.getMonth() + 1}` }, './templates/mailToMallMensual.html')
            // sendEmail('Proyectos TI - GLOBAL FIBER <proyectos.ti@globalfiber.com.pe>', ['edward.espinoza@globalfiber.com.pe'], [], [], 'REPORTE DE REGISTROS MENSUAL', { dia: mesAnteriorFormateado, linkDeDescarga: `http://metricas.globalfiber.com.pe:3000/repo/mall/data?year=${mesAnterior.getFullYear()}&month=${mesAnterior.getMonth() + 1}` }, './templates/mailToMallMensual.html')
        }
    }
}, 30000)





// Envía el correo
function sendEmail(from, to, cc, bcc, subject, content, templatePath) {
    // {{linkDeDescarga}}
    // {{dia}}
    let template = fs.readFileSync(templatePath, 'utf-8')
    template = template.replace('{{dia}}', content.dia)
    template = template.replace('{{linkDeDescarga}}', content.linkDeDescarga)
    const mailOptions = {
        from,
        to,
        cc,
        bcc,
        subject,
        html: template
        // attachments: [
        //     {
        //         filename: 'acumulado18102023.xlsx',
        //         path: 'downloads/acumulado18102023.xlsx',
        //     },
        // ],
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(info);
            console.log('Error al enviar el correo: ' + error);
        } else {
            console.log('Correo enviado: ' + info.response);
            console.log('Correo Enviado');
            const actualTime = new Date()
            const newTime = {
                year: actualTime.getFullYear(),
                month: actualTime.getMonth() + 1,
                day: actualTime.getDate(),
                hour: actualTime.getHours(),
                minute: actualTime.getMinutes(),
                second: actualTime.getSeconds()
            }
            fs.writeFile('./db.json', JSON.stringify(newTime), (err) => {
                if (err) {
                    console.error('Error al escribir en db.json:', err);
                } else {
                    console.log('Hora guardada en db.json');
                }
            });
        }
    });
}

