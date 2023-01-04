// import forge from "node-forge";

// new Promise((f, r) =>
//   forge.pki.rsa.generateKeyPair(2048, (err: any, pair: any) =>
//     err ? r(err) : f(pair)
//   )
// )
//   .then((keypair: any) => {
//     console.log("[Enc/Dec]");
//     const priv = keypair.privateKey;
//     const pub = keypair.publicKey;

//     const encrypted = pub.encrypt("Hello World!");
//     console.log("encrypted:", forge.util.encode64(encrypted));

//     const decrypted = priv.decrypt(encrypted);
//     console.log("decrypted:", decrypted);
//     return keypair;
//   })
//   .then((keypair) => {
//     console.log("[Sign/Verify]");
//     const priv = keypair.privateKey;
//     const pub = keypair.publicKey;

//     const md = forge.md.sha256.create();
//     md.update("Hello World!");
//     const data = md.digest().bytes();
//     const sign = priv.sign(md);
//     console.log("sign:", forge.util.encode64(sign));

//     console.log("verify:", pub.verify(data, sign));
//     return keypair;
//   })
//   .then((keypair) => {
//     console.log("[Sign/Verify with PSS]");
//     const priv = keypair.privateKey;
//     const pub = keypair.publicKey;

//     const md = forge.md.sha256.create();
//     md.update("Hello World!");
//     const data = md.digest().bytes();

//     // Alice: sign
//     const pss1 = forge.pss.create({
//       md: forge.md.sha256.create(),
//       mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
//       saltLength: 28,
//     });
//     var sign = priv.sign(md, pss1);
//     console.log("sign:", forge.util.encode64(sign));

//     // Bob: verify
//     const pss2 = forge.pss.create({
//       md: forge.md.sha256.create(),
//       mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
//       saltLength: 28,
//     });
//     console.log("verify:", pub.verify(data, sign, pss2));
//     return keypair;
//   })

//   .catch((err) => console.log(err));
