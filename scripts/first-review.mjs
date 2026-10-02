import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('../evidence/round-1',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['small',320,568]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5514/');await page.waitForTimeout(1200);await page.screenshot({path:`../evidence/round-1/${name}.png`,fullPage:true});const state=await page.evaluate(()=>window.__RESON.state());console.log(JSON.stringify({name,state,errors}));await writeFile(`../evidence/round-1/${name}.json`,JSON.stringify({state,errors},null,2));await page.close();
}
await browser.close();
