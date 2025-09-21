// tuodaan Express-kehys, konfigurointitiedot ja käytettävä data
const express = require('express');
const path = require('path');
const { port, host } = require('./config.json');
//let ohjelmointikielet = require('./data/ohjelmointikielet.json');
const { haeAuto, haeKaikkiAutot, lisaaAuto } = require('./tietokantakerros')
// luodaan Express-sovellus
const app = express();

// otetaan EJS-moottori käyttöön
app.set('view engine', 'ejs');

// kerrotaan EJS-moottorille, missä sivupohjat ovat. Oletus on views-kansio.
app.set('views', path.join(__dirname, 'sivupohjat'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// määritellään käytettävät osoitteet
app.get('/autot', async (req, res) => {
    try {
        const autodata = await haeKaikkiAutot()
        res.render('listaus', {
            otsikko: "Teon autosivu",
            autot: autodata
        });

    } catch (error) {
        console.log(error);

    }
});

app.get('/lisays', (req, res) => {
    res.render('lisays', {
        otsikko: "Teon autosivu",

    });
});

app.post('/lisays', async (req, res) => {
    try {
        //auton merkki
        //auton malli
        //auton vuosimalli
        //auton omistaja
        //yo tiedot saat lomakkeesta
        //tulosta tiedot ensin konsoliin esim console.log(merkki)
        //const vastaus = await lisaaAuto(merkki, malli, vuosimalli, omistaja)

        const merkki = req.body.merkki
        const malli = req.body.malli
        const vuosimalli = req.body.vuosimalli
        const omistaja = req.body.omistaja

        console.log(merkki)

        await lisaaAuto(merkki, malli, vuosimalli, omistaja)

        res.render("lisatty", { otsikko: "autosivusto", nimi: "teo" });

    } catch (error) {
        //jotain virheen käsittelyä
    }
})

app.post('/haku', async (req, res) => {
    try {

        const haku = req.body.haku

        console.log(haku)

        const hakudata = await haeAuto(haku)

        res.render("hakutulos", { hakudata:hakudata, otsikko: "autosivusto", nimi: "teo" });

    } catch (error) {
        //jotain virheen käsittelyä
    }
})

app.get('/haeAuto', async (req, res) => {
    const haku = req.query.haku;

    try {
        const tulokset = await haeAuto(haku);
        res.json(tulokset); // palautetaan JSON, esim. fetchille
    } catch (error) {
        res.status(400).json({
            virhe: "Haussa tapahtui virhe",
            info: error.message
        });
    }
});

// Määritellään reitti '/autohaku' Expressissä
app.get('/autohaku', async (req, res) => {
    const haku = req.query.haku;

    try {
        const tulokset = await haeAuto(haku);

        if (tulokset.length === 0) {
            return res.render('alert', {
                otsikko: 'Hakutulos',
                viesti: 'Kohdetta ei löytynyt!'
            });
        }

        res.render('hakutulos', {
            otsikko: 'Hakutulokset',
            autot: tulokset
        });

    } catch (error) {
        console.error(error);
        res.render('alert', {
            otsikko: 'Virhe',
            viesti: 'Haussa tapahtui virhe!'
        });
    }
});
 

// käynnistetään palvelin
app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));