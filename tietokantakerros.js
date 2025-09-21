const mysql = require('mysql2');
const dbconfig = require('./dbconfigs.json');

function haeKaikkiAutot() {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(dbconfig);
        connection.connect();
        connection.query("Select * from auto", (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
        connection.end()
    })
}

function lisaaAuto(merkki, malli, vuosimalli, omistaja) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(dbconfig);
        connection.connect();
        connection.query(`INSERT INTO auto (merkki, malli, vuosimalli, omistaja) VALUES ("${merkki}", "${malli}", ${vuosimalli}, "${omistaja}")`, (err, data) => { //tee kysely insert into jne ja käytä parametrien arvoja
            if (err) {
                reject({ viesti: "lisäys ei onnistunut" }) //{viesti: "lisays ei onnistunut"}
            }
            resolve({ viesti: "lisäys onnistui" }); //{viesti: "lisays onnistui"}
        })
        connection.end()
    })
}

function haeAuto(haku) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!haku || typeof haku !== 'string') {   // tarkasta hakutermi, !haku
                return reject(new Error('Virheellinen hakutermi'));
            }
            const kaikkiAutot = await haeKaikkiAutot();   // haeKaikkiAutot
            const suodatetutAutot = kaikkiAutot.filter(auto => {   // datan filtteröinti hakutermin mukaan
                // Muutetaan vuosimalli merkkijonoksi
                const vuosimalliString = String(auto.vuosimalli);

                // Suodatetaan autot hakutermillä
                return (
                    auto.merkki.toLowerCase().includes(haku.toLowerCase()) ||
                    auto.malli.toLowerCase().includes(haku.toLowerCase()) ||
                    auto.omistaja.toLowerCase().includes(haku.toLowerCase()) ||
                    vuosimalliString.includes(haku) // Tarkista vuosimalli hakutermillä
                );
            });

            if (suodatetutAutot.length === 0) {   // tarkasta paljonko dataa sieltä tuli data.length==0
                return resolve([]);   // Jos ei löytynyt mitään, palautetaan tyhjä taulukko
            }

            resolve(suodatetutAutot);   // palautetaan suodatetut autot
        } catch (error) {
            reject(error)  // Jos tulee virhe, palautetaan se
        }
    })
}

module.exports = { haeAuto, haeKaikkiAutot, lisaaAuto }; // tarpeen mukaan
