const API_BASE = '/api/pdf';
let uploadedFiles = [];

// Initialiser
document.addEventListener('DOMContentLoaded', function() {
    checkHealth();
    loadUploadedFiles();
    initMotionIcons();
});

// Initialiser les motion icons
function initMotionIcons() {
    // Lottie animations will be loaded here
    // For now, we'll use animated SVG icons
    const iconMap = {
        'upload': '<svg class="lottie-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16V8M12 8L9 11M12 8L15 11M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'create': '<svg class="lottie-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'merge': '<svg class="lottie-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 7V12L12 8M8 12L4 8" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17V12L12 16M16 12L20 16" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'split': '<svg class="lottie-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 18V12" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 15L12 18L15 15" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'extract': '<svg class="lottie-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12H2" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L5 9" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L5 15" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12C22 16.9706 18.4183 21 14 21C9.58172 21 6 16.9706 6 12C6 7.02944 9.58172 3 14 3C18.4183 3 22 7.02944 22 12Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'delete': '<svg class="lottie-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H5H21" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11V17" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11V17" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'password': '<svg class="lottie-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15V18" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12C19 12.7956 18.6839 13.5587 18.1213 14.1213C17.5587 14.6839 16.7956 15 16 15H8C7.20435 15 6.44129 14.6839 5.87868 14.1213C5.31607 13.5587 5 12.7956 5 12C5 11.2044 5.31607 10.4413 5.87868 9.87868C6.44129 9.31607 7.20435 9 8 9H16C16.7956 9 17.5587 9.31607 18.1213 9.87868C18.6839 10.4413 19 11.2044 19 12Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 9V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V9" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'images': '<svg class="lottie-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 13.5L11.5 10.5L14.5 13.5L17.5 10.5" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 16L6 13L9 16" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'text': '<svg class="lottie-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 13H8" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17H8" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 9H9H8" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };

    // Replace emoji icons with SVG motion icons
    const cardHeaders = document.querySelectorAll('.card h2');
    cardHeaders.forEach(header => {
        const text = header.textContent.trim();
        let iconKey = '';
        
        if (text.includes('Télécharger')) iconKey = 'upload';
        else if (text.includes('Créer')) iconKey = 'create';
        else if (text.includes('Fusionner')) iconKey = 'merge';
        else if (text.includes('Diviser')) iconKey = 'split';
        else if (text.includes('Extraire des pages')) iconKey = 'extract';
        else if (text.includes('Supprimer')) iconKey = 'delete';
        else if (text.includes('Protéger')) iconKey = 'password';
        else if (text.includes('Convertir en images')) iconKey = 'images';
        else if (text.includes('Extraire le texte')) iconKey = 'text';
        
        if (iconKey && iconMap[iconKey]) {
            header.innerHTML = iconMap[iconKey] + ' ' + text;
        }
    });
}

// Vérifier la santé du service
function checkHealth() {
    fetch(`${API_BASE}/health`)
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                showAlert('uploadAlert', 'Service connecté ✓', 'success');
            }
        })
        .catch(e => showAlert('uploadAlert', 'Erreur de connexion', 'error'));
}

// Charger les fichiers uploadés
function loadUploadedFiles() {
    const selects = document.querySelectorAll('select[id*="File"]');
    selects.forEach(select => {
        select.innerHTML = '<option value="">-- Choisir un fichier --</option>';
        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                select.appendChild(option);
            });
        }
    });
}

// Afficher une alerte
function showAlert(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="alert ${type}">${message}</div>`;
    setTimeout(() => {
        element.innerHTML = '';
    }, 5000);
}

// Upload PDF
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('pdfFile').files[0];
    if (!file) return;

    document.getElementById('uploadLoading').style.display = 'block';
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            uploadedFiles.push(data.data);
            loadUploadedFiles();
            showAlert('uploadAlert', data.message, 'success');
            document.getElementById('uploadForm').reset();
        } else {
            showAlert('uploadAlert', data.message, 'error');
        }
    } catch (e) {
        showAlert('uploadAlert', 'Erreur: ' + e.message, 'error');
    } finally {
        document.getElementById('uploadLoading').style.display = 'none';
    }
});

// Créer un PDF
document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('textInput').value;

    document.getElementById('createLoading').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/create?text=${encodeURIComponent(text)}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            uploadedFiles.push(data.data);
            loadUploadedFiles();
            showAlert('createAlert', data.message, 'success');
            document.getElementById('createForm').reset();
        } else {
            showAlert('createAlert', data.message, 'error');
        }
    } catch (e) {
        showAlert('createAlert', 'Erreur: ' + e.message, 'error');
    } finally {
        document.getElementById('createLoading').style.display = 'none';
    }
});

// Fusionner les PDFs
document.getElementById('mergeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const files = Array.from(document.querySelectorAll('input[name="mergeFiles"]:checked')).map(cb => cb.value);

    if (files.length < 2) {
        showAlert('mergeAlert', 'Sélectionnez au moins 2 fichiers', 'error');
        return;
    }

    document.getElementById('mergeLoading').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/merge?files=${files.join(',')}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            uploadedFiles.push(data.data);
            loadUploadedFiles();
            showAlert('mergeAlert', data.message, 'success');
        } else {
            showAlert('mergeAlert', data.message, 'error');
        }
    } catch (e) {
        showAlert('mergeAlert', 'Erreur: ' + e.message, 'error');
    } finally {
        document.getElementById('mergeLoading').style.display = 'none';
    }
});

// Remplir la liste de fusion
function updateMergeList() {
    const container = document.getElementById('fileChecklist');
    container.innerHTML = uploadedFiles.map(file => `
        <div style="margin: 5px 0;">
            <input type="checkbox" name="mergeFiles" value="${file}" id="merge_${file}">
            <label for="merge_${file}" style="margin: 0; font-weight: normal;">${file}</label>
        </div>
    `).join('');
}

setInterval(() => {
    updateMergeList();
}, 500);

// Diviser un PDF
document.getElementById('splitForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('splitFile').value;

    if (!file) {
        showAlert('splitAlert', 'Sélectionnez un fichier', 'error');
        return;
    }

    document.getElementById('splitLoading').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/split?file=${file}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            data.data.forEach(f => uploadedFiles.push(f));
            loadUploadedFiles();
            showAlert('splitAlert', `${data.data.length} fichiers créés`, 'success');
        } else {
            showAlert('splitAlert', data.message, 'error');
        }
    } catch (e) {
        showAlert('splitAlert', 'Erreur: ' + e.message, 'error');
    } finally {
        document.getElementById('splitLoading').style.display = 'none';
    }
});

// Extraire des pages
document.getElementById('extractForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('extractFile').value;
    const startPage = document.getElementById('startPage').value;
    const endPage = document.getElementById('endPage').value;

    if (!file || !startPage || !endPage) {
        showAlert('extractAlert', 'Remplissez tous les champs', 'error');
        return;
    }

    document.getElementById('extractLoading').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/extract-pages?file=${file}&startPage=${startPage}&endPage=${endPage}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            uploadedFiles.push(data.data);
            loadUploadedFiles();
            showAlert('extractAlert', data.message, 'success');
        } else {
            showAlert('extractAlert', data.message, 'error');
        }
    } catch (e) {
        showAlert('extractAlert', 'Erreur: ' + e.message, 'error');
    } finally {
        document.getElementById('extractLoading').style.display = 'none';
    }
});

// Supprimer des pages
document.getElementById('deleteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('deleteFile').value;
    const pageNumbers = document.getElementById('pageNumbers').value.split(',').map(n => n.trim()).filter(n => n);

    if (!file || pageNumbers.length === 0) {
        showAlert('deleteAlert', 'Remplissez tous les champs', 'error');
        return;
    }

    document.getElementById('deleteLoading').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/delete-pages?file=${file}&pageNumbers=${pageNumbers.join(',')}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            uploadedFiles.push(data.data);
            loadUploadedFiles();
            showAlert('deleteAlert', data.message, 'success');
            document.getElementById('deleteForm').reset();
        } else {
            showAlert('deleteAlert', data.message, 'error');
        }
    } catch (e) {
        showAlert('deleteAlert', 'Erreur: ' + e.message, 'error');
    } finally {
        document.getElementById('deleteLoading').style.display = 'none';
    }
});

// Ajouter un mot de passe
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('passwordFile').value;
    const password = document.getElementById('password').value;

    if (!file || !password) {
        showAlert('passwordAlert', 'Remplissez tous les champs', 'error');
        return;
    }

    document.getElementById('passwordLoading').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/add-password?file=${file}&password=${encodeURIComponent(password)}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            uploadedFiles.push(data.data);
            loadUploadedFiles();
            showAlert('passwordAlert', data.message, 'success');
            document.getElementById('passwordForm').reset();
        } else {
            showAlert('passwordAlert', data.message, 'error');
        }
    } catch (e) {
        showAlert('passwordAlert', 'Erreur: ' + e.message, 'error');
    } finally {
        document.getElementById('passwordLoading').style.display = 'none';
    }
});

// Convertir en images
document.getElementById('imagesForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('imagesFile').value;

    if (!file) {
        showAlert('imagesAlert', 'Sélectionnez un fichier', 'error');
        return;
    }

    document.getElementById('imagesLoading').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/to-images?file=${file}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            data.data.forEach(f => uploadedFiles.push(f));
            loadUploadedFiles();
            showAlert('imagesAlert', `${data.data.length} images créées`, 'success');
        } else {
            showAlert('imagesAlert', data.message, 'error');
        }
    } catch (e) {
        showAlert('imagesAlert', 'Erreur: ' + e.message, 'error');
    } finally {
        document.getElementById('imagesLoading').style.display = 'none';
    }
});

// Extraire le texte
document.getElementById('textForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('textFile').value;

    if (!file) {
        showAlert('textAlert', 'Sélectionnez un fichier', 'error');
        return;
    }

    document.getElementById('textLoading').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/extract-text?file=${file}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            document.getElementById('textOutput').value = data.data;
            document.getElementById('extractedText').style.display = 'block';
            showAlert('textAlert', 'Texte extrait avec succès', 'success');
        } else {
            showAlert('textAlert', data.message, 'error');
        }
    } catch (e) {
        showAlert('textAlert', 'Erreur: ' + e.message, 'error');
    } finally {
        document.getElementById('textLoading').style.display = 'none';
    }
});
