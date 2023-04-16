const product = require('../../models/Products');
const multer = require('multer');
const Product = require('../../models/Products');
const upload = multer({ dest: '../upload/products/' });

const InsertProduct = async (req, res) => {
    const { name, subtitles, description, outstanding, price } = req.body
    const image = req.file.originalname;

    try {
        const newProduct = new Product({
            name, subtitles, images, description, outstanding, price
        });
        await newProduct.save();

        res.status(201).json(newProduct)
    }catch(err)
    {
        res.status(500).json({ message: "Server error" })
    }
}

const InsertProductColor = async (req, res) => {
    Product.findById(req.body.productId, (err, parentProduct) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error finding parent product');
        } else {
          // Create a new ProductColor document with the data from req.body
          const newProductColor = new ProductColor({
            name: req.body.name,
            color: req.body.color,
            images: req.body.images,
            product: parentProduct._id
          });
      
          // Save the new ProductColor document to the database
          newProductColor.save((err, productColor) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error creating product color');
            } else {
              console.log(`New product color for product ${parentProduct.name} added`);
              res.status(200).send('Product color created successfully');
            }
          });
        }
    });
}

//router.post('/products', upload.array('slideImages', 10), upload.single('avatar'), InsertProduct);
