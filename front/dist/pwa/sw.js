if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,f)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let n={};const r=e=>a(e,i),d={module:{uri:i},exports:n,require:r};s[i]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(f(...e),n)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"educacion"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/_commonjsHelpers.a26ce4be.js",revision:"d4f69e568fc32089318e656fe63fc978"},{url:"assets/axios.b82ed81b.js",revision:"bf893b600a63b36f80afddd3e4ccb98c"},{url:"assets/ClosePopup.80440ead.js",revision:"99d5ed5e34caa208881c82458c5f245b"},{url:"assets/ErrorNotFound.dd0ff88c.js",revision:"f48986411bd6c34df31bcff77ed4f663"},{url:"assets/Excel.a5e16faf.js",revision:"054a1e4f6f464b5a6360b1e1b3b607cc"},{url:"assets/fa-brands-400.232c6f6a.woff2",revision:"b55b1345f0b919f0cab774ec25d6654e"},{url:"assets/fa-brands-400.e28096fa.ttf",revision:"b7dee83cb5ee2c47b053e2620f4bbb78"},{url:"assets/fa-regular-400.9174757e.ttf",revision:"3c264849ff4eb9b6e99eab9cd54c80ae"},{url:"assets/fa-regular-400.c27da6f8.woff2",revision:"aa7c5fa494807f7a9ec907defee083e8"},{url:"assets/fa-solid-900.ae17c16a.woff2",revision:"1ec0ba058c021acf7feaa18081445d63"},{url:"assets/fa-solid-900.b4990d0d.ttf",revision:"0a95f951745ba02faa8773ea6a1ebaed"},{url:"assets/fa-v4compatibility.c7a869fa.woff2",revision:"fdb652dcc200dd23b8b8040176858c36"},{url:"assets/fa-v4compatibility.ff8f525f.ttf",revision:"95b97efa98f9e3fb869bc9634c43a0cc"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/format.e8b08a95.js",revision:"086282e9bdb0b49d85e7c7ac514870c0"},{url:"assets/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUcel5euIg.35dca8a7.woff2",revision:"0ba49c096a77b67734434cebcaf2e14d"},{url:"assets/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUcY.8e94758c.woff",revision:"0e4321a7c0dda51d72a669ac5892fc39"},{url:"assets/Imprimir.c794f38a.js",revision:"e8e594b924d3f5ff8274b1c8d950161a"},{url:"assets/index.2cf8de7d.js",revision:"81686fa35acd92f22b91c5ac6e6142e9"},{url:"assets/index.c16f2377.css",revision:"fd9357acf170b66560f425595b1de8d5"},{url:"assets/IndexPage.5fcd6696.js",revision:"dcbff6116e049e1c0bd9e4a865dbd5cf"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/Login.de881783.js",revision:"a9768910c1829a254b6f0cbd092c251b"},{url:"assets/MainLayout.4c5417b9.css",revision:"b4eebf8b52735244fcbd8842fdc93182"},{url:"assets/MainLayout.d15a980f.js",revision:"f13e52c3891e2314b796962deea6a79d"},{url:"assets/moment.66cd1a64.js",revision:"8d6353eb8bc3bdaee00167c17f2545ca"},{url:"assets/Paciente.1eed7fec.js",revision:"98ccaa47ecc13071e8ceea0085c9be34"},{url:"assets/PacienteNew.de8c5cc7.js",revision:"2f1f159a972ea40995e6856294177114"},{url:"assets/PacienteShow.4ca1e35c.js",revision:"375cd3765233aef59f3aa6a3bccd686b"},{url:"assets/Productos.39324f22.js",revision:"5d7a4b28de100d189f9ee57fbb6434ef"},{url:"assets/QBtnDropdown.2d26c6e1.js",revision:"287e5389f5eeaaaead7c572cff3b6e14"},{url:"assets/QBtnGroup.1009a850.js",revision:"9a9859625f98bcc5abb357dffb07bfa3"},{url:"assets/QForm.b1918a55.js",revision:"2752827de09a67bf31aac3d06dc0979a"},{url:"assets/QLayout.879f049e.js",revision:"774037a384e5ca56867036a1ed33ee01"},{url:"assets/QList.156594eb.js",revision:"792d2af10d7ae977d1d74d18b7cad2f5"},{url:"assets/QMarkupTable.0b8458d2.js",revision:"0a90e22782b216fb2b658710eba1ab5a"},{url:"assets/QPage.1ba5f62e.js",revision:"c45e6e7dae783a86c6ff886a9067f765"},{url:"assets/QResizeObserver.924fb9ba.js",revision:"bdf490e8c503ff5f849f0323bfd40852"},{url:"assets/QSpace.f7b112fa.js",revision:"b0fe90695986547e58dd0b0b78907bbc"},{url:"assets/QTable.3d078db5.js",revision:"3d45ddc98e1ba9df80195dfe9533c3c5"},{url:"assets/quasar-logo-vertical.20d65235.svg",revision:"df53e3410a5844071decf476ecad7f78"},{url:"assets/touch.9135741d.js",revision:"88ce3843cbd234458fc111496fd90393"},{url:"assets/Usuarios.0cf2665b.js",revision:"cf5a2ad1912e9e34f1091fa898045797"},{url:"assets/VentaNew.85ba6dde.js",revision:"725f28d7fbdb9bfb73ceb5760bfb4122"},{url:"assets/Ventas.10826585.js",revision:"8f1094a561397e3ddcffae26d9e5491d"},{url:"dark-logo-text-CiIbURQ-.svg",revision:"469169c5cd3986843cb7b154c7dfa0fb"},{url:"favicon.ico",revision:"9333ea3dac9586e4d7a283b0e14852c0"},{url:"icon.svg",revision:"443b4df8a657ab06a88bf22574414471"},{url:"icons/apple-icon-120x120.png",revision:"5865cac60f468e300628f3c601d61734"},{url:"icons/apple-icon-152x152.png",revision:"5feb0ea5d46fde80219cc83062ec47db"},{url:"icons/apple-icon-167x167.png",revision:"76c3be7741c5de46a8d1faca35bfcfb5"},{url:"icons/apple-icon-180x180.png",revision:"7f301a3b7f124bfc3b1d7b6567f0948d"},{url:"icons/apple-launch-1080x2340.png",revision:"6b706857576bc1609c8c19e6ea9b041b"},{url:"icons/apple-launch-1125x2436.png",revision:"b2686e6caaa643bcb7a0736c2eae85a6"},{url:"icons/apple-launch-1170x2532.png",revision:"bc43b936fdce4f5d4b105946f0817d64"},{url:"icons/apple-launch-1179x2556.png",revision:"30bad059ec91fa2fe6a2c252444273ac"},{url:"icons/apple-launch-1242x2208.png",revision:"29197d1a76167d0e4e823df247e6c319"},{url:"icons/apple-launch-1242x2688.png",revision:"0890a22ef730578c9ab8105cc0174699"},{url:"icons/apple-launch-1284x2778.png",revision:"527ea9f3e37da25155cbc0b915c89bbe"},{url:"icons/apple-launch-1290x2796.png",revision:"beb9e199ad354b871d6583c09419d7de"},{url:"icons/apple-launch-1536x2048.png",revision:"6d5253361e24b612f350aa7a9047d6e2"},{url:"icons/apple-launch-1620x2160.png",revision:"5aac4307ae46c4a69abaabeaab5faa5c"},{url:"icons/apple-launch-1668x2224.png",revision:"fd2d4f995bf254a5d64c14ce74e756d3"},{url:"icons/apple-launch-1668x2388.png",revision:"0129ee331beab361fa7bdcc1d23541da"},{url:"icons/apple-launch-2048x2732.png",revision:"f51e08cc50def448902a992d2dcb20da"},{url:"icons/apple-launch-750x1334.png",revision:"3c3ace54e32742e0848876fd9c446690"},{url:"icons/apple-launch-828x1792.png",revision:"992ea78bd4f5deb697cb7198b8f66e86"},{url:"icons/favicon-128x128.png",revision:"c7c932d61498c94f122ff538a6d24827"},{url:"icons/favicon-16x16.png",revision:"978187ac7df7aef73c607cca78f7a48b"},{url:"icons/favicon-32x32.png",revision:"f5e757ccb116cc75f46a074c36a0b559"},{url:"icons/favicon-96x96.png",revision:"eacea05d461343bfdee5d5e271943209"},{url:"icons/icon-128x128.png",revision:"c7c932d61498c94f122ff538a6d24827"},{url:"icons/icon-192x192.png",revision:"1bfe2e3cca0a31079a7f1a0fb6080157"},{url:"icons/icon-256x256.png",revision:"88a35ddb9d44bbb8bf5cbb3fd93c0462"},{url:"icons/icon-384x384.png",revision:"33fbd24024273e5c912f65a259065d8f"},{url:"icons/icon-512x512.png",revision:"1f2e2ac0bc63e649ac259686ec0da24d"},{url:"icons/ms-icon-144x144.png",revision:"29d7fe3bb0bbed18bfb20d44f82676ad"},{url:"icons/safari-pinned-tab.svg",revision:"56714351e1e66906cb783281ba2f0788"},{url:"index.html",revision:"7f739f86349f145f043778d0efd13af8"},{url:"login-bg-BprgzFH_.svg",revision:"f3c50959249b8bd352bb7ccae213a015"},{url:"logo.png",revision:"49c3a412a1034465879d046497b2f773"},{url:"logo2.png",revision:"9871fc3a2c1da9871dd6e1123b52aab9"},{url:"logoLargo.png",revision:"d7a662bedbd4cece26350214bee51209"},{url:"logoLargo2.png",revision:"7f6bdd843e4d587b0c7541de81a49eef"},{url:"manifest.json",revision:"300647d67bcc40d8ffdfec28fbdd5b09"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));
