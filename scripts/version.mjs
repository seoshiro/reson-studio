import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
let commit=process.env.GITHUB_SHA||'local';
try{commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();}catch{/* initial build */}
writeFileSync('public/version.json',JSON.stringify({project:'RESON',commit}));
