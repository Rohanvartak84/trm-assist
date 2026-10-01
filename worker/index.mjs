import app from './app.mjs';
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY'};
async function equal(a,b){
 const digest=async value=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)));
 const [x,y]=await Promise.all([digest(a),digest(b)]);let difference=0;for(let i=0;i<x.length;i++)difference|=x[i]^y[i];return difference===0;
}
export default {async fetch(request,env,ctx){
 // Deny all routes, including assets, until a strong access password is configured.
 if(typeof env.ACCESS_PASSWORD!=='string'||env.ACCESS_PASSWORD.length<20)return new Response('Setup incomplete. Add an ACCESS_PASSWORD secret of at least 20 characters in Cloudflare Worker settings.',{status:503,headers});
 const auth=request.headers.get('Authorization')||'';let credentials='';
 if(auth.length<=2048&&/^Basic /i.test(auth)){try{credentials=atob(auth.slice(6))}catch{}}
 if(!credentials||!await equal(credentials,`registerlens:${env.ACCESS_PASSWORD}`))return new Response('Sign in to Register Lens.',{status:401,headers:{...headers,'WWW-Authenticate':'Basic realm="Register Lens"'}});
 const response=await app.fetch(request,env,ctx);const output=new Response(response.body,response);for(const [k,v] of Object.entries(headers))output.headers.set(k,v);return output;
}};
