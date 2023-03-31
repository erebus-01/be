const product = require('../../models/Products');
const multer = require('multer');
const Product = require('../../models/Products');
const upload = multer({ dest: '../upload/products/' });

const InsertProduct = async (req, res) => {
    const images = req.files.map(file => file.name);
    const colors = req.body.colors;
    const colorCodes = req.body.colorCodes;
    const avatar = req.body.avatar;

    const slideImages = [];

    for(let i = 0; i < images.length; i++)
    {
        slideImages.push({
            image: images[i],
            color: colors[i],
            colorCode: colorCodes[i]
        })
    }

    const { title, subtitle, benefit, price, content } = req.body;

    try {
        const newProduct = new Product({
            title, subtitle, benefit, price, avatar, content, slideImages
        });

        await newProduct.save();

        res.status(201).json(newProduct)
    }catch(err)
    {
        res.status(500).json({ message: "Server error" })
    }
}

//router.post('/products', upload.array('slideImages', 10), upload.single('avatar'), InsertProduct);
