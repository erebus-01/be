const Post = require('../../models/Posts')

const GetPosts = async (req, res, next) => {
    try {
        Post.find({})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(500).json({ error: error.message }));
    }catch(error) {
        res.status(500).json({ json: error });
    }
}

const GetPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        Post.findById(id)
          .then(post => res.status(200).json(post))
          .catch(error => res.status(500).json({ error: error.message }));
    }catch(error) {
        res.status(500).json({ json: error });
    }
}

const InsertPost = async (req, res, next) => {
    try{
        const { title, author, topic, image, content } = req.body;

        titleFixed = title.replace(/\n/g, '');
        authorFixed = author.replace(/\n/g, '');
        topicFixed = topic.replace(/[ \t\n]+/g, '');
        imageFixed = image.replace(/[ \t\n]+/g, '');

        const newPost = new Post({ title: titleFixed, author: authorFixed, topic: topicFixed, image: imageFixed, content });
    
        await newPost.save()
            .then(() => {
                res.status(201).json({ message: 'Post saved successfully' })
            })
            .catch((error) => {
                res.status(500).json({ message: error })
            });
    }catch(error) {
        res.status(500).json({ message: `Have error: ${error}` });
    }
}

const UpdatePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { title, author, topic, image, content } = req.body;

        titleFixed = title.toUpperCase().replace(/\n/g, '');
        authorFixed = author.toUpperCase().replace(/\n/g, '');
        topicFixed = topic.replace(/[ \t\n]+/g, '');
        imageFixed = image.replace(/[ \t\n]+/g, '');

        Post.findByIdAndUpdate(id, { title: titleFixed, author: authorFixed, topic: topicFixed, image: imageFixed, content }, { new: true})
          .then(() => res.status(200).json({ message: 'Post updated successfully' }))
          .catch(error => res.status(500).json({ message: error }));
    }catch(error) {
        res.status(500).json({ json: error });
    }
}

const DeletePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        Post.findByIdAndDelete(id)
          .then(() => res.status(200).json({ message: 'Post deleted successfully' }))
          .catch(error => res.status(500).json({ error: error.message }));
    }catch(error) {
        res.status(500).json({ json: error });
    }
}

module.exports = {
    GetPosts,
    GetPost,
    InsertPost,
    UpdatePost,
    DeletePost
}