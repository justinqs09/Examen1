const express = require('express');
const sql = require('mssql');
const app = express();


const dbConfig = {
    user: 'DESKTOP-EF0ETOD\\Justin',    
    server: 'localhost',  
    port: 5500,  
    database: 'Examen1',
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
};





sql.connect(dbConfig, (err) => {
    if (err) {
        console.error("Error conectando a la base de datos: ", err);
        return;
    }
    console.log('Conexión a la base de datos exitosa.');
});


app.post('/ingresar-datos', async (req, res) => {
    const { provincia, calidadAire, hora, lluvia, clima, tempMin, tempMax, humedad } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('provincia', sql.VarChar, provincia)
            .input('calidadAire', sql.Int, calidadAire)
            .input('hora', sql.Time, hora)
            .input('lluvia', sql.VarChar, lluvia)
            .input('clima', sql.VarChar, clima)
            .input('tempMin', sql.Decimal, tempMin)
            .input('tempMax', sql.Decimal, tempMax)
            .input('humedad', sql.Decimal, humedad)
            .query('INSERT INTO CalidadAire (Provincia, CalidadAire, Hora, Lluvia, Clima, TempMin, TempMax, Humedad) VALUES (@provincia, @calidadAire, @hora, @lluvia, @clima, @tempMin, @tempMax, @humedad)');

        res.status(200).send('Datos ingresados correctamente');
    } catch (err) {
        console.error("Error ejecutando query: ", err);
        res.status(500).send('Error insertando datos');
    }
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
