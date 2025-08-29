const Resource = require('../models/Resource');

exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ dateAdded: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load resources' });
  }
};

exports.getResourceByType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!['article', 'video', 'contact'].includes(type)) {
      return res.status(400).json({ message: 'Invalid resource type' });
    }
    const resources = await Resource.find({ type }).sort({ dateAdded: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load resources' });
  }
};


exports.addResource = async (req, res) => {
  try {
    const { title, type, content, description } = req.body;
    if (!title || !type || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const resource = new Resource({ title, type, content, description });
    await resource.save();
    res.status(201).json({ message: 'Resource added', resource });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add resource' });
  }
};


exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params; // resource id from URL
    const deleted = await Resource.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete resource' });
  }
};
