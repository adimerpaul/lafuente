if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,f)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let b={};const r=e=>a(e,i),n={module:{uri:i},exports:b,require:r};s[i]=Promise.all(c.map((e=>n[e]||r(e)))).then((e=>(f(...e),b)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"educacion"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/_commonjsHelpers.a26ce4be.js",revision:"d4f69e568fc32089318e656fe63fc978"},{url:"assets/axios.163642f0.js",revision:"8bdf4449d83e890cbd73c630740dae2f"},{url:"assets/ClosePopup.160a1389.js",revision:"659acd0c55b55a810b4ccf05346f5b2f"},{url:"assets/Compras.06cece59.js",revision:"f43ed0bf254a511edb5d1393b7947dfa"},{url:"assets/ComprasCreate.39cda5ef.js",revision:"a160df82d40e07ab4125b811630a9d90"},{url:"assets/ErrorNotFound.555ee4e1.js",revision:"1a95191df7dea14787dd82fc67533533"},{url:"assets/Excel.a5e16faf.js",revision:"054a1e4f6f464b5a6360b1e1b3b607cc"},{url:"assets/fa-brands-400.232c6f6a.woff2",revision:"b55b1345f0b919f0cab774ec25d6654e"},{url:"assets/fa-brands-400.e28096fa.ttf",revision:"b7dee83cb5ee2c47b053e2620f4bbb78"},{url:"assets/fa-regular-400.9174757e.ttf",revision:"3c264849ff4eb9b6e99eab9cd54c80ae"},{url:"assets/fa-regular-400.c27da6f8.woff2",revision:"aa7c5fa494807f7a9ec907defee083e8"},{url:"assets/fa-solid-900.ae17c16a.woff2",revision:"1ec0ba058c021acf7feaa18081445d63"},{url:"assets/fa-solid-900.b4990d0d.ttf",revision:"0a95f951745ba02faa8773ea6a1ebaed"},{url:"assets/fa-v4compatibility.c7a869fa.woff2",revision:"fdb652dcc200dd23b8b8040176858c36"},{url:"assets/fa-v4compatibility.ff8f525f.ttf",revision:"95b97efa98f9e3fb869bc9634c43a0cc"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/format.2cae61da.js",revision:"3e44fb3b0266cf3450e20c11b260836a"},{url:"assets/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUcel5euIg.35dca8a7.woff2",revision:"0ba49c096a77b67734434cebcaf2e14d"},{url:"assets/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUcY.8e94758c.woff",revision:"0e4321a7c0dda51d72a669ac5892fc39"},{url:"assets/Imprimir.2b20819b.js",revision:"21661b62cb7bceaee4d31382f1c5b78c"},{url:"assets/index.a9e21178.css",revision:"b130654fa610dc17014de60a99c1df6d"},{url:"assets/index.b06572a0.js",revision:"ef3f452553c4dc1ce1c62f7c308ff9ed"},{url:"assets/IndexPage.36a5c08f.js",revision:"cbc3b859bbc9540ad1bcf3f4fe823e04"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/Login.46eba431.js",revision:"a424254c15435b55918cf704e4767e59"},{url:"assets/MainLayout.4c5417b9.css",revision:"b4eebf8b52735244fcbd8842fdc93182"},{url:"assets/MainLayout.760d8ec9.js",revision:"8a8cfa2f0113a694b0c9e79fcbf35d7e"},{url:"assets/moment.40bc58bf.js",revision:"ab4b3406c96318822b09f02b2b5723b9"},{url:"assets/Paciente.23a00698.js",revision:"d4c3babe834050c1d56eb979d27fd6a4"},{url:"assets/PacienteNew.62c63095.js",revision:"bbdf105e2515b14c1591b986782b84f8"},{url:"assets/PacienteShow.a5762372.js",revision:"044c2b9c3cf6016ca1f1b1af81cec580"},{url:"assets/Productos.bf6a804a.js",revision:"73c6cc3d2f68845720a3b8c1d97dfb8d"},{url:"assets/ProductosVencer.bd685899.js",revision:"e4e36ef9d766cc1f1f783bd26de314b7"},{url:"assets/ProductosVencidos.5bff2536.js",revision:"b1e7e935850fc5ae9fa0f282395e13ca"},{url:"assets/Proveedores.8fa53abc.js",revision:"11f39a75fd6bcffa03ecbda263365561"},{url:"assets/QBadge.eab7fb32.js",revision:"d24031d5a9dcda7c6af461ebe7c7d726"},{url:"assets/QBtnDropdown.af88a833.js",revision:"1cf1bfcf2e25ba3e39fc2bc8970d334e"},{url:"assets/QBtnGroup.2aca49b6.js",revision:"694d964bed356d5c4a875d7fd2b1e25b"},{url:"assets/QChip.cff6d88d.js",revision:"fadcdef085d2d448cbfe6ab25979cc4d"},{url:"assets/QForm.e993d99a.js",revision:"47cf5638d0d62943372cd36b8f67f83c"},{url:"assets/QImg.ffa351a0.js",revision:"bc7dab2ccb1c460c113da568c74445c1"},{url:"assets/QLayout.9160157a.js",revision:"75cfedfa558aaadb766325b343373478"},{url:"assets/QList.fb2aa972.js",revision:"ef269d8d0af8f3d25ac077c1f9e28702"},{url:"assets/QMarkupTable.8b056a53.js",revision:"fa361aa95516b5cd9c825f24a074512b"},{url:"assets/QMenu.c1e63efd.js",revision:"53179d5a6784a8ffdf30514cf58dd441"},{url:"assets/QPage.a459216a.js",revision:"13dc4e434e046110aafb7bd6a95c5bc6"},{url:"assets/QPagination.fe3ca408.js",revision:"8f86e18347f0bc8e05bf3d01be6ea16f"},{url:"assets/QResizeObserver.daf6fab7.js",revision:"69dc98aa29798b3b03d88482874b0b2d"},{url:"assets/QSelect.22ca404a.js",revision:"1a10eb1c64b1fd58604c35fac2b298cb"},{url:"assets/QSpace.d75b8165.js",revision:"5765d1bf9ea56ae9ab1c3574e6602f5e"},{url:"assets/QTable.1fff7f3f.js",revision:"4b93c14659fb6aeca4f102d860ebc05f"},{url:"assets/selection.4897e411.js",revision:"bbf1e9e8d5fa8f5c7a2a20e6e2d667b5"},{url:"assets/touch.9135741d.js",revision:"88ce3843cbd234458fc111496fd90393"},{url:"assets/TouchPan.ec450f1b.js",revision:"a9493820dad438417ccabe93537ef553"},{url:"assets/Usuarios.344f3f99.js",revision:"89f35383f4983d99853c66cf6b2e1f96"},{url:"assets/VentaNew.70d12f7d.js",revision:"8b9dc4bf88bcb9b0d1501e2f7b715708"},{url:"assets/Ventas.adcab507.js",revision:"c90a7acccdb28a7bce1b9f82cc6860df"},{url:"dark-logo-text-CiIbURQ-.svg",revision:"469169c5cd3986843cb7b154c7dfa0fb"},{url:"favicon.ico",revision:"9333ea3dac9586e4d7a283b0e14852c0"},{url:"icon.svg",revision:"443b4df8a657ab06a88bf22574414471"},{url:"icons/apple-icon-120x120.png",revision:"5865cac60f468e300628f3c601d61734"},{url:"icons/apple-icon-152x152.png",revision:"5feb0ea5d46fde80219cc83062ec47db"},{url:"icons/apple-icon-167x167.png",revision:"76c3be7741c5de46a8d1faca35bfcfb5"},{url:"icons/apple-icon-180x180.png",revision:"7f301a3b7f124bfc3b1d7b6567f0948d"},{url:"icons/apple-launch-1080x2340.png",revision:"6b706857576bc1609c8c19e6ea9b041b"},{url:"icons/apple-launch-1125x2436.png",revision:"b2686e6caaa643bcb7a0736c2eae85a6"},{url:"icons/apple-launch-1170x2532.png",revision:"bc43b936fdce4f5d4b105946f0817d64"},{url:"icons/apple-launch-1179x2556.png",revision:"30bad059ec91fa2fe6a2c252444273ac"},{url:"icons/apple-launch-1242x2208.png",revision:"29197d1a76167d0e4e823df247e6c319"},{url:"icons/apple-launch-1242x2688.png",revision:"0890a22ef730578c9ab8105cc0174699"},{url:"icons/apple-launch-1284x2778.png",revision:"527ea9f3e37da25155cbc0b915c89bbe"},{url:"icons/apple-launch-1290x2796.png",revision:"beb9e199ad354b871d6583c09419d7de"},{url:"icons/apple-launch-1536x2048.png",revision:"6d5253361e24b612f350aa7a9047d6e2"},{url:"icons/apple-launch-1620x2160.png",revision:"5aac4307ae46c4a69abaabeaab5faa5c"},{url:"icons/apple-launch-1668x2224.png",revision:"fd2d4f995bf254a5d64c14ce74e756d3"},{url:"icons/apple-launch-1668x2388.png",revision:"0129ee331beab361fa7bdcc1d23541da"},{url:"icons/apple-launch-2048x2732.png",revision:"f51e08cc50def448902a992d2dcb20da"},{url:"icons/apple-launch-750x1334.png",revision:"3c3ace54e32742e0848876fd9c446690"},{url:"icons/apple-launch-828x1792.png",revision:"992ea78bd4f5deb697cb7198b8f66e86"},{url:"icons/favicon-128x128.png",revision:"c7c932d61498c94f122ff538a6d24827"},{url:"icons/favicon-16x16.png",revision:"978187ac7df7aef73c607cca78f7a48b"},{url:"icons/favicon-32x32.png",revision:"f5e757ccb116cc75f46a074c36a0b559"},{url:"icons/favicon-96x96.png",revision:"eacea05d461343bfdee5d5e271943209"},{url:"icons/icon-128x128.png",revision:"c7c932d61498c94f122ff538a6d24827"},{url:"icons/icon-192x192.png",revision:"1bfe2e3cca0a31079a7f1a0fb6080157"},{url:"icons/icon-256x256.png",revision:"88a35ddb9d44bbb8bf5cbb3fd93c0462"},{url:"icons/icon-384x384.png",revision:"33fbd24024273e5c912f65a259065d8f"},{url:"icons/icon-512x512.png",revision:"1f2e2ac0bc63e649ac259686ec0da24d"},{url:"icons/ms-icon-144x144.png",revision:"29d7fe3bb0bbed18bfb20d44f82676ad"},{url:"icons/safari-pinned-tab.svg",revision:"56714351e1e66906cb783281ba2f0788"},{url:"index.html",revision:"ce572fd3372d52e3746cbae4e3056ef4"},{url:"login-bg-BprgzFH_.svg",revision:"f3c50959249b8bd352bb7ccae213a015"},{url:"logo.png",revision:"49c3a412a1034465879d046497b2f773"},{url:"logo2.png",revision:"9871fc3a2c1da9871dd6e1123b52aab9"},{url:"logoLargo.png",revision:"d7a662bedbd4cece26350214bee51209"},{url:"logoLargo2.png",revision:"7f6bdd843e4d587b0c7541de81a49eef"},{url:"manifest.json",revision:"300647d67bcc40d8ffdfec28fbdd5b09"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));
