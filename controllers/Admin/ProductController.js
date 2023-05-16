const ProductColor = require('../../models/ProductColor');
const Product = require('../../models/Products');

const InsertProduct = async (req, res) => {
  try {
    const { name, subtitles, image, description, benefit, price } = req.body

    const benefitArray = benefit.split('\n');
    const descriptionArray = description.split('\n');
    const nameFixed = name.replace(/\n/g, '');
    const subtitlesFixed = subtitles.replace(/\n/g, '');
    const imageFixed = image.replace(/[ \t\n]+/g, '');
    const priceFixed = price.replace(/\n/g, '');

    const newProduct = new Product({
      name: nameFixed, 
      subtitles: subtitlesFixed, 
      image: imageFixed, 
      description: descriptionArray, 
      benefit: benefitArray, 
      price: priceFixed,
    });

    await newProduct.save()
      .then(() => {
        res.status(201).json({ 
          message: "Post product successfully", 
          status: 'success'
        });
      })
      .catch(err => res.status(500).json({ message: `Have error ${err}` }));

    }catch(err)
    {
      res.status(500).json({ message: `Server error ${err}` })
    }
}
const GetProducts = async (req, res) => {
  try {
    Product.find({})
    .then(products => res.status(200).json(products))
    .catch(err => res.status(500).json({ message: err }))
  }catch(error) {res.status(500).json({ message: error })}
}
const GetProduct = async (req, res) => {
  try {
    const id = req.params.id;
    Product.findById({ _id: id})
    .then(product => res.status(200).json(product))
    .catch(err => res.status(500).json({ message: err}))
  }catch(error) {res.status(500).json({ message: error })}
}
const UpdateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, subtitles, image, description, benefit, price } = req.body

    const benefitArray = benefit.split('\n');
    const descriptionArray = description.split('\n');
    const nameFixed = name.replace(/\n/g, '');
    const subtitlesFixed = subtitles.replace(/\n/g, '');
    const imageFixed = image.replace(/[ \t\n]+/g, '');
    const priceFixed = price.replace(/\n/g, '');

    Product.findByIdAndUpdate(id, {
      name: nameFixed, 
      subtitles: subtitlesFixed, 
      image: imageFixed, 
      description: descriptionArray, 
      benefit: benefitArray,
      price: priceFixed,
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
    const productId = req.params.product;
    const product = await Product.findOne({ _id: productId }).exec();
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const colors = await ProductColor.find({ product: productId }).exec();
    if(colors.length === 0)
    {
      return res.status(203).json({ message: 'This product is not available in color' });
    } 
    res.status(200).json({ json: colors, message: 'Product colors fetched successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const GetColor = async (req, res) => {
  try {
    const id = req.params.id;
    const productId = req.params.product

    await ProductColor.find({ _id: id, product: productId })
    .then((colors) => {
      res.status(200).json({ message: 'Product colors fetched successfully', json: colors })
    })
    .catch((error) => {
      res.status(500).json({ message: error })
    })

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


    const existingColor = await ProductColor.findOne({ product: id, name: nameFixed, color: colorFixed });
    if (existingColor) {
      res.status(400).json({ message: 'Color already exists' });
      return;
    }

    const product = await Product.findById({ _id: id });
        const newColor = new ProductColor({
          name: nameFixed,
          color: colorFixed,
          images: imagesFixed,
          product: product._id
        })
    
        await newColor.save()
          .then((saveColor) => {
            Product.findByIdAndUpdate(id, { $push: {colors: saveColor._id} }, { new: true, upsert: true })
              .then((product) => res.status(200).json({ message: 'Product saved successfully', json: saveColor, product }))
              .catch(error => res.status(500).json({ message: error }));
          })
          .catch(error => res.status(500).json({ message: error }));

  }catch(error) {
    res.status(500).json({ json: error });
  }
}
const UpdateColor = async (req, res) => {
  try {
    const id = req.params.id;
    const product = req.params.product;
    const { name, color, images } = req.body;

    const nameFixed = name.replace(/\n/g, '');
    const colorFixed = color.replace(/[ \t\n]+/g, '');
    const imagesFixed = images.split(/\r?\n/).filter(str => str.trim() !== '');

    await ProductColor.findByIdAndUpdate({_id: id, product: product}, { name: nameFixed, color: colorFixed, images: imagesFixed }, { new: true })
    .then(() => res.status(200).json({ message: "Update color product successfully." }))
    .catch(err => res.status(500).json({ message: err }));

  }catch(error) {
    res.status(500).json({ json: error });
  }
}
const DeleteColor = async (req, res) => {
  try {
    const id = req.params.id;
    const product = req.params.product

    await ProductColor.findByIdAndDelete({ _id: id, product: product })
    .then(() => res.status(201).json({ message: 'Color deleted successfully' }))
    .catch(err => res.status(500).json({ message: err }));
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
