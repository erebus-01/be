const ProductColor = require('../../models/ProductColor');
const Product = require('../../models/Products');

const InsertProduct = async (req, res) => {
  try {
    const { name, subtitles, image, description, benefit, price } = req.body

    const benefitArray = benefit.split('\n');
    const nameFixed = name.replace(/\n/g, '');
    const subtitlesFixed = subtitles.replace(/\n/g, '');
    const imageFixed = image.replace(/[ \t\n]+/g, '');
    const priceFixed = price.replace(/\n/g, '');

    const newProduct = new Product({
      name: nameFixed, 
      subtitles: subtitlesFixed, 
      image: imageFixed, 
      description, 
      benefit: benefitArray, 
      price: priceFixed
    });
    await newProduct
      .save()
      .then(() => {
        res.status(201).json({ 
          message: "Post product successfully", 
          status: 'success', 
          json: { nameFixed, subtitlesFixed, imageFixed, description, benefitArray, priceFixed }
        });
      })
      .catch(err => res.status(500).json({ message: error }));

    }catch(err)
    {
      res.status(500).json({ message: "Server error" })
    }
}
const GetProducts = async (req, res) => {
  try {
    Product.find({})
    .then(products => res.status(200).json(posts))
    .catch(err => res.status(500).json({ message: err}))
  }catch(error) {res.status(500).json({ message: error })}
}
const GetProduct = async (req, res) => {
  try {
    const id = req.params.id;
    Product.findById({id})
    .then(products => res.status(200).json(posts))
    .catch(err => res.status(500).json({ message: err}))
  }catch(error) {res.status(500).json({ message: error })}
}
const UpdateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, subtitles, image, description, benefit, price } = req.body

    const benefitArray = benefit.split('\n');
    const nameFixed = name.replace(/\n/g, '');
    const subtitlesFixed = subtitles.replace(/\n/g, '');
    const imageFixed = image.replace(/[ \t\n]+/g, '');
    const priceFixed = price.replace(/\n/g, '');

    Product.findByIdAndUpdate(id, {
      name: nameFixed, 
      subtitles: subtitlesFixed, 
      image: imageFixed, 
      description, 
      benefit: benefitArray,
      price: priceFixed
    }, { new: true })
    .then(() => res.status(200).json({ message: 'Product updated successfully' }))
    .catch(error => res.status(500).json({ message: error }));
  }catch(error) {res.status(500).json({ message: error })}
}
const DeleteProduct = async (req, res) => {
  try {
    const id = req.params.id
    Product.findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: 'Product deleted successfully' }))
    .catch(error => res.status(500).json({ message: error }));
  }catch(error) {res.status(500).json({ message: error })}
}


const GetColors = async (req, res) => {
  try {
    const productId = req.params.product

    await Product.findOne({ _id: productId })
      .then(async () => res.status(200).json({ message: 'Product found successfully'}))
      .catch((error) => {
          res.status(500).json({ message: error })
      });

  }catch(error) {
    res.status(500).json({ json: error });
  }
}
const GetColor = async (req, res) => {
  try {

  }catch(error) {
    res.status(500).json({ json: error });
  }
}

const InsertColor = async (req, res) => {
  try {
    const id = req.params.product;
    const { name, color, images } = req.body;

    const nameFixed = name.replace(/\n/g, '');
    const colorFixed = color.replace(/[ \t\n]+/g, '');
    const imagesFixed = images.split(/\r?\n/).filter(str => str.trim() !== '');

    await ProductColor.findOne({ name: nameFixed, color: colorFixed })
      .then(async (exitsedColor) => {
        if(exitsedColor)
        {
          res.status(400).json({ message: 'Color already exists' });
        }
        else
        {
          const product = await Product.findById({ _id: id});
          const newColor = new ProductColor({
            name: nameFixed,
            color: colorFixed,
            images: imagesFixed,
            product: product._id
          })
      
          await newColor.save()
            .then((saveColor) => {
              Product.findByIdAndUpdate(id, { colors: saveColor._id }, { new: true})
                .then((product) => res.status(200).json({ message: 'Product saved successfully', json: saveColor, product }))
                .catch(error => res.status(500).json({ message: error }));
            })
            .catch(error => res.status(500).json({ message: error }));
        }
      })
      .catch(error =>{
        res.status(500).json({ json: error });
      })
  }catch(error) {
    res.status(500).json({ json: error });
  }
}
const UpdateColor = async (req, res) => {
  try {

  }catch(error) {
    res.status(500).json({ json: error });
  }
}
const DeleteColor = async (req, res) => {
  try {

  }catch(error) {
    res.status(500).json({ json: error });
  }
}

module.exports = {
  GetProducts,
  GetProduct,
  InsertProduct,
  UpdateProduct,
  DeleteProduct,

  GetColors,
  GetColor,
  InsertColor,
  UpdateColor,
  DeleteColor
}
