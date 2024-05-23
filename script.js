function generateImage() {
    const name = document.getElementById('name').value.trim();
    const designation = document.getElementById('designation').value.trim();
    const company = document.getElementById('company').value.trim();
    const booth = document.getElementById('booth').value.trim();
    const profpicInput = document.getElementById('profpic');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const downloadLink = document.getElementById('download');
    const shareLink = document.getElementById('share');

    // Check if all fields are filled
    if (!name || !designation || !company || !booth || !profpicInput.files || !profpicInput.files[0]) {
        alert('All fields are mandatory');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        const profpic = new Image();
        profpic.src = e.target.result;

        profpic.onload = () => {
            // Load the background image
            const backgroundImage = new Image();
            backgroundImage.src = 'exhibitor.png';

            backgroundImage.onload = () => {
                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the background image
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "#fff";
                ctx.font = "bold 36px Montserrat";
                ctx.fillText(name, canvas.width / 2 - 60, canvas.height / 2 - 70);
                ctx.font = "36px Montserrat";
                ctx.fillText(designation, canvas.width / 2 - 60, canvas.height / 2 - 20);
                ctx.fillText(company, canvas.width / 2 - 60, canvas.height / 2 + 30);
                ctx.font = "24px Montserrat";
                ctx.fillText(booth, 16, canvas.height - 40);

                // Properties for the profile picture
                const profilePicSize = 292;
                const profilePicX = 60;
                const profilePicY = 340;
                const borderThickness = 6;

                // Border circle
                ctx.beginPath();
                ctx.arc(profilePicX + profilePicSize / 2, profilePicY + profilePicSize / 2, profilePicSize / 2 + borderThickness, 0, Math.PI * 2);
                ctx.fillStyle = "#112f6020";
                ctx.fill();

                // Circle profile picture clipping
                ctx.save();
                ctx.beginPath();
                ctx.arc(profilePicX + profilePicSize / 2, profilePicY + profilePicSize / 2, profilePicSize / 2, 0, Math.PI * 2);
                ctx.clip();

                // Calculate the scaling factor to cover the circle
                const aspectRatio = profpic.width / profpic.height;
                let drawWidth, drawHeight, offsetX, offsetY;

                if (aspectRatio > 1) {
                    // Image is wider than it is tall
                    drawWidth = profilePicSize * aspectRatio;
                    drawHeight = profilePicSize;
                    offsetX = (profilePicSize - drawWidth) / 2;
                    offsetY = 0;
                } else {
                    // Image is taller than it is wide
                    drawWidth = profilePicSize;
                    drawHeight = profilePicSize / aspectRatio;
                    offsetX = 0;
                    offsetY = (profilePicSize - drawHeight) / 2;
                }

                // Draw the profile picture
                ctx.drawImage(profpic, profilePicX + offsetX, profilePicY + offsetY, drawWidth, drawHeight);

                // Reset clipping
                ctx.restore();

                // Enable the download link
                downloadLink.href = canvas.toDataURL('image/png');
                downloadLink.classList.remove('btn-disabled');
                shareLink.classList.remove('btn-disabled');
            };
        };
    };

    reader.readAsDataURL(profpicInput.files[0]);
}

// Initial setup for download link (empty image)
window.onload = () => {
    const downloadLink = document.getElementById('download');
    const shareLink = document.getElementById('share');
    downloadLink.classList.add('btn-disabled');
    shareLink.classList.add('btn-disabled');

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const backgroundImage = new Image();
    backgroundImage.src = 'exhibitor.png';

    backgroundImage.onload = () => {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    };
};

document.getElementById('share').addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    canvas.toBlob((blob) => {
        const file = new File([blob], 'generated_image.png', { type: 'image/png' });
        const filesArray = [file];
        const shareData = {
            files: filesArray,
            title: 'I am attending COMEX 2024',
            text: 'Join me by registering at www.comex-global.com'
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
            navigator.share(shareData).then(() => {
                console.log('Image shared successfully.');
            }).catch((error) => {
                console.error('Error sharing image:', error);
            });
        } else {
            alert('Sharing not supported on this browser. Please download the image and share it manually.');
        }
    })
})
