const express = require('express');
const docRouter = express.Router();
const mongoose = require('mongoose');
const Doc = require('../models/docSchema');
const config = require('../config');

module.exports = (upload) => {
    const url = config.mongoURI;
    const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

    let gfs;

    connect.once('open', () => {
        // initialize stream
        gfs = new mongoose.mongo.GridFSBucket(connect.db, {
            bucketName: "uploads"
        });
    });

    // Front-end for testing purposes

    docRouter.route('/')
        .get((req, res) => {
            res.render('index')
        })

    //      POST: Upload a single image/file to Image collection

    docRouter.route('/upload')
        .post(upload.single('file'), (req, res, next) => {
            console.log(req.body, typeof(req.body));
            console.log(req.file);

            let newFile = new Doc({
                tags: req.body.tags.split(","),
                filename: req.file.filename,
                fileId: req.file.id,
            });

            newFile.save()
                .then((file) => {
                    res.status(200).json({
                        success: true,
                        file,
                    });
                })
                .catch(err => res.status(500).json(err));
        })
  

    //     GET: Fetches file metadata based on tag filter

    docRouter.route('/tags/:id')
        .get((req,res) => {
            let taglist = req.params.id.split(",");
            if(taglist.length === 0){
                Doc.find({})
                .then(files => {
                    res.status(200).json({
                        success: true,
                        files,
                    });
                })
                .catch(err => res.status(500).json(err));
            } else {
                Doc.find({ tags: { $all: taglist } })
                .then((files) => {
                    res.status(200).json({
                        success: true,
                        files
                    })
                })
                .catch(err => res.status(500).json(err));

            }
        })
    
    //     GET: Downloads file based on fileId
   
    docRouter.route('/docs/:id')
        .get((req, res, next) => {
            gfs.find({_id:  mongoose.Types.ObjectId(req.params.id)}).toArray((err, files) => {
                if(err) {
                    return res.status(500).json({
                        message: "Error finding file",
                        err
                    })
                }
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }
                res.set('Content-Type', files[0].contentType);
                res.set('Content-Disposition', 'attachment; filename="' + files[0].filename + '"');
                gfs.openDownloadStreamByName(files[0].filename).pipe(res);
            });
        });


    return docRouter;
};