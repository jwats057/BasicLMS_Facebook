const utilsServices = require('./utils.service');
const express = require('express');
const router =  express.Router();
// var storage = firebase.storage();
// var storageRef = firebase.storage().ref();
// var dannyRef = storageRef.child('facebook.jpg');
//
// const googleStorage = require('@google-cloud/storage');
// const Multer = require('multer');
// const storage = googleStorage({
//     projectId: "learnfiu",
//     keyFilename: "<learnfiu_db.json>"
// });
//
// const bucket = firebase.storage().bucket('');
//
// const multer = Multer({
//     storage: Multer.memoryStorage(),
//     limits: {
//         fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
//     }
// });
//
// const uploadImageToStorage = (file) => {
//     return new Promise((resolve, reject) => {
//         if (!file) {
//             reject('No image file');
//         }
//         let newFileName = `${file.originalname}_${Date.now()}`;
//
//         let fileUpload = bucket.file(newFileName);
//
//         const blobStream = fileUpload.createWriteStream({
//             metadata: {
//                 contentType: file.mimetype
//             }
//         });
//
//         blobStream.on('error', (error) => {
//             reject('Something is wrong! Unable to upload at the moment.');
//         });
//
//         blobStream.on('finish', () => {
//             // The public URL can be used to directly access the file via HTTP.
//             const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
//             resolve(url);
//         });
//
//         blobStream.end(file.buffer);
//     });
// }
module.exports = (passport) => {

    router.get('/hello', async (req, res, next) => {
        const resp = await utilsServices.helloWorld();
        await res.json({
            payload: resp,
        });
    });

    // router.post('/upload', multer.single('file'), (req, res) => {
    //     console.log('Upload Image');
    //
    //     let file = req.file;
    //     if (file) {
    //         uploadImageToStorage(file).then((success) => {
    //             res.status(200).send({
    //                 status: 'success'
    //             });
    //         }).catch((error) => {
    //             console.error(error);
    //         });
    //     }
    // });

    router.get('/date', async (req, res, next) => {
        await res.json(new Date());
    });

    // router.post('/image-upload', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
    //     console.log(req.body);
    //     const resp = await utilsServices.imageUpload();
    //     await res.json(resp);
    // })

    router.get('/logs', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await utilsServices.getLogs();
        await res.json(resp);
    });

    return router;
};
