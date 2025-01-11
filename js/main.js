document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadBox = uploadArea.querySelector('.upload-box');
    const imageInput = document.getElementById('imageInput');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 点击上传区域触发文件选择
    uploadBox.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Upload box clicked');
        imageInput.click();
    });

    // 阻止图片输入框的点击事件冒泡
    imageInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 处理拖放上传
    uploadArea.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('File dropped');
        uploadBox.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            console.log('Processing dropped file:', file.name);
            handleImageUpload(file);
        }
    });

    // 处理文件选择
    imageInput.addEventListener('change', (e) => {
        console.log('File selected');
        const file = e.target.files[0];
        if (file) {
            console.log('Processing file:', file.name);
            handleImageUpload(file);
        }
    });

    // 处理图片上传
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = () => {
                // 显示原图
                originalPreview.src = originalImage.src;
                originalSize.textContent = formatFileSize(file.size);
                
                // 显示预览区域
                previewArea.style.display = 'block';
                
                // 压缩图片
                compressImage();
            };
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布尺寸
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        
        // 绘制图片
        ctx.drawImage(originalImage, 0, 0);
        
        // 压缩
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的图片
        compressedPreview.src = compressedDataUrl;
        
        // 计算压缩后的大小
        const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
        if (originalImage) {
            compressImage();
        }
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedPreview.src;
        link.click();
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 