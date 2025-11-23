# Dataset Setup

## Download CIFAKE Dataset

1. Visit https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-synthetic-images
2. Download the dataset
3. Extract and organize as follows:

```
data/
├── train/
│   ├── REAL/
│   │   └── (60,000 real images)
│   └── FAKE/
│       └── (60,000 AI-generated images)
└── test/
    ├── REAL/
    │   └── (test images)
    └── FAKE/
        └── (test images)
```

## Dataset Information

- **Total Images**: 120,000
- **Real Images**: 60,000 (from CIFAR-10)
- **Fake Images**: 60,000 (Generated with Stable Diffusion)
- **Classes**: 10 (airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck)
- **Image Size**: 32x32 pixels
- **Format**: JPG/PNG

## Alternative: Use Sample Data

For testing, you can use any images:
1. Create the folder structure above
2. Add some real photos to `REAL/` folders
3. Add some AI-generated images to `FAKE/` folders