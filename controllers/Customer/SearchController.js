const Product = require("../../models/Products")

const Search = async (req, res) => {
    try {
        const { searchrQuery } = req.query;
        const products = await Product.find({
            $or: [
                { title: { $regex: searchrQuery, $options: 'i' } },
                { subtitles: { $regex: searchrQuery, $options: 'i' } }, 
            ]
        }).exec();

        res.json({ products });
    }catch(error){
        
    }
}