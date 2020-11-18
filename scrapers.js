const puppeteer = require('puppeteer');

async function tiendita(url) {
    try {

    const browser = await puppeteer.launch({headless: true,});
    const page = await browser.newPage();
  
    const navigationPromise = page.waitForNavigation();
  
    await page.goto(url);
  
    //Clickeo en el boton para devolverme a los locales
    await page.waitForSelector('#breadcrumbWrap > #breadcrumbContainer > .breadcrumbs > .available > a');
    await page.click('#breadcrumbWrap > #breadcrumbContainer > .breadcrumbs > .available > a');

    await navigationPromise;
        
    await page.waitForTimeout(3000);
                                
    await page.waitForSelector('#resultListContainer > header > section.order > a');
    await page.click('#resultListContainer > header > section.order > a');    
    await navigationPromise;
    await page.waitForSelector('#drop1 > li:nth-child(4) > a');
    await page.click('#drop1 > li:nth-child(4) > a');
    await navigationPromise;
    
    //Espero para que aprezca el selector de la lista con los locales
    await page.waitForSelector('#resultListContainer')
    await page.waitForSelector('div.clearfix')

    const result = await page.$$('div.clearfix'); 
    
    
    const nombres = await page.evaluate(() => 
        Array.from(document.querySelectorAll('ul figure a img'))
        .map(nombre => nombre.alt.trim())
    );
    
    /*
    const logos = await page.evaluate(() => 
        Array.from(document.querySelectorAll('ul figure a img'))
        .map(logo => logo.dataset.original)
    );
    */

    
    const categorie = await page.evaluate(() => 
        Array.from(document.querySelectorAll('#resultList > .restaurant-wrapper .restaurantData > .restaurantInfo > span.categories'))
        .map(categ => categ.innerText)
    );

    //div#main div.row.rowContainer div#resultContainerList section#resultListContainer div#listContent ul#resultList li figure
    const partners = await page.evaluate(() => 
        Array.from(document.querySelectorAll('#resultList > .restaurant-wrapper'))
        .map(compact => ({
            //El mapa compact retorna un objeto
            nombre: compact.querySelector('figure a img').alt.trim(),
            logo: compact.querySelector('figure > .arrivalLogo > .radius-fix').dataset.original,
            direccion: compact.querySelector('.restaurantData > .restaurantInfo > .address').innerText,
            categoria: compact.querySelector('.restaurantData > .restaurantInfo > span.categories'),
            estado: null
        }))
    ); 
    
    
    const locales = await page.$$eval('#resultList > .restaurant-wrapper', rows => {
        return rows.map(row => {
            const propiedades = {};
            const element_nombre = row.querySelector('.arrivalName');
            propiedades.nombre = element_nombre.title;
            const element_logo = row.querySelector('.radius-fix');
            propiedades.logo = element_logo.src;   //se puede tontear el src()
            const element_direccion = row.querySelector('.address');
            propiedades.direccion = row;
        
        });
    });

    
    
 
    
    console.log(partners);
    console.log(partners.length);
    console.log("resultados: ", result.length)

    
    await browser.close();
    
    } catch (e) {
        console.log('Ha ocurrido un error: ', e.stack)    
    }
}

tiendita('https://www.pedidosya.cl/restaurantes/valparaiso?a=%20brasil%202241&doorNumber=2241&lat=-33.0447279&lng=-71.61250729999999');
