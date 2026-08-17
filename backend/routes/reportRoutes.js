const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// ========================================
// Import Report Controllers
// ========================================

const {
    createReport,
    getReports,
    getReportById,
    updateDoctorNotes,
    updateReport,
    deleteReport
} = require("../controllers/reportController");


// ========================================
// CREATE UPLOAD DIRECTORY
// ========================================

const uploadDirectory = path.join(
    __dirname,
    "../uploads/reports"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );
}


// ========================================
// MULTER STORAGE
// ========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            uploadDirectory
        );

    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(
                file.originalname
            );

        const fileName =
            `report-${Date.now()}-${Math.round(
                Math.random() * 1E9
            )}${extension}`;

        cb(
            null,
            fileName
        );

    }

});


// ========================================
// FILE FILTER
// ========================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "application/pdf",

        "image/jpeg",

        "image/jpg",

        "image/png"

    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only PDF, JPG, JPEG and PNG files are allowed."
            ),
            false
        );

    }

};


// ========================================
// MULTER CONFIGURATION
// ========================================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {

        fileSize: 10 * 1024 * 1024

    }

});


// ========================================
// CREATE NEW REPORT
// ========================================
// POST /api/reports
//
// Frontend should send:
// multipart/form-data
//
// File field name:
// reportFile
// ========================================

router.post(
    "/",
    upload.single("reportFile"),
    (req, res, next) => {

        try {

            // ========================================
            // HANDLE UPLOADED FILE
            // ========================================

            if (req.file) {

                req.body.reportFile =
                    `/uploads/reports/${req.file.filename}`;

            }


            // ========================================
            // HANDLE RESULTS
            // ========================================
            // When using multipart/form-data,
            // arrays may arrive as strings.
            //
            // Example:
            // "[{\"parameter\":\"Hemoglobin\",...}]"
            // ========================================

            if (
                typeof req.body.results ===
                "string"
            ) {

                try {

                    req.body.results =
                        JSON.parse(
                            req.body.results
                        );

                }

                catch (error) {

                    req.body.results = [];

                }

            }


            // ========================================
            // CONTINUE TO CONTROLLER
            // ========================================

            next();

        }

        catch (error) {

            next(error);

        }

    },
    createReport
);


// ========================================
// GET ALL REPORTS
// ========================================
// GET /api/reports
// ========================================

router.get(
    "/",
    getReports
);


// ========================================
// GET SINGLE REPORT
// ========================================
// GET /api/reports/:id
// ========================================

router.get(
    "/:id",
    getReportById
);


// ========================================
// UPDATE DOCTOR NOTES
// ========================================
// PUT /api/reports/:id/notes
// ========================================

router.put(
    "/:id/notes",
    updateDoctorNotes
);


// ========================================
// UPDATE REPORT
// ========================================
// PUT /api/reports/:id
// ========================================

router.put(
    "/:id",
    updateReport
);


// ========================================
// DELETE REPORT
// ========================================
// DELETE /api/reports/:id
// ========================================

router.delete(
    "/:id",
    deleteReport
);


// ========================================
// MULTER / UPLOAD ERROR HANDLER
// ========================================

router.use(
    (error, req, res, next) => {

        console.error(
            "Report Upload Error:",
            error
        );


        if (
            error instanceof multer.MulterError
        ) {

            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    message:
                        "File size cannot exceed 10 MB."

                });

            }


            return res.status(400).json({

                message:
                    error.message

            });

        }


        if (
            error.message ===
            "Only PDF, JPG, JPEG and PNG files are allowed."
        ) {

            return res.status(400).json({

                message:
                    error.message

            });

        }


        return res.status(500).json({

            message:
                "Unable to upload report.",

            error:
                error.message

        });

    }
);


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;