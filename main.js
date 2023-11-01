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
        const actualTime = new Date()
        const actualDate = `${String(actualTime.getDate() - 1).padStart(2, '0')}/${String(actualTime.getMonth() + 1).padStart(2, '0')}/${String(actualTime.getFullYear())}`
        if (dbTime.year === actualTime.getFullYear() && dbTime.month === actualTime.getMonth() + 1 && dbTime.day === actualTime.getDate()) {
            // console.log('Ya se envió el archivo el día de hoy');
        } else {
            console.log(`Enviar archivo ahora ${actualDate} - ${actualTime.getHours() + ':' + actualTime.getMinutes() + ':' + actualTime.getSeconds()}`);
            // sendEmail(from, to, cc, bcc, subject, content)
            // sendEmail('Proyectos TI - GLOBAL FIBER <proyectos.ti@globalfiber.com.pe>', ['jonathan.moreno@aventura-adm.com'], ['carlos.cabello@globalfiber.com.pe'], ['edward.espinoza@globalfiber.com.pe'], 'REPORTE DE REGISTROS', { dia: actualDate, linkDeDescarga: `http://metricas.globalfiber.com.pe:3000/repo/mall/data?year=2023&month=10&day=${actualTime.getDate() - 1}` })
            sendEmail('Proyectos TI - GLOBAL FIBER <proyectos.ti@globalfiber.com.pe>', ['jonathan.moreno@aventura-adm.com'], ['carlos.cabello@globalfiber.com.pe'], ['edward.espinoza@globalfiber.com.pe'], 'REPORTE DE REGISTROS', { dia: "31/10/2023", linkDeDescarga: `http://metricas.globalfiber.com.pe:3000/repo/mall/data?year=2023&month=10&day=31` })
            // sendEmail('Proyectos TI - GLOBAL FIBER <proyectos.ti@globalfiber.com.pe>', ['edward.espinoza@globalfiber.com.pe'], [], [], 'REPORTE DE REGISTROS', { dia: actualDate, linkDeDescarga: `http://metricas.globalfiber.com.pe:3000/repo/mall/data?year=2023&month=10&day=${actualTime.getDate() - 1}` })
        }
    }
}, 600000)





// Envía el correo
function sendEmail(from, to, cc, bcc, subject, content) {
    // {{linkDeDescarga}}
    // {{dia}}
    let template = fs.readFileSync('./templates/mailToMall.html', 'utf-8')
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

