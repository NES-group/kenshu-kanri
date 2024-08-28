// ユーザー登録処理
function registerUser() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!email.endsWith('@nes.english-school.com')) {
        alert('NESメールアドレスのみ登録可能です。');
        return false;
    }

    // ユーザー情報を保存する処理（バックエンドに送信）
    // 実装例：fetch APIを使用してデータベースに保存

    alert('登録が完了しました！');
    return false;
}

// ログイン処理
function loginUser() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    // ユーザー認証処理（バックエンドに問い合わせ）
    // 実装例：fetch APIを使用して認証

    alert('ログインが成功しました！');
    window.location.href = 'training_list.html';
    return false;
}

// 研修一覧の表示
function loadTrainings() {
    fetch('/trainings')
        .then(response => response.json())
        .then(data => {
            const trainingList = document.getElementById('training-list');
            trainingList.innerHTML = '';  // 一度リセット
            
            data.forEach(training => {
                const trainingItem = document.createElement('div');
                trainingItem.className = 'training-item';
                trainingItem.innerHTML = `
                    <p>${training.name} - ${training.date} ${training.time}</p>
                    <button onclick="reserveTraining('${training.id}')">予約する</button>
                `;
                trainingList.appendChild(trainingItem);
            });
        });
}

// 予約処理
function reserveTraining(trainingId) {
    if (confirm('この研修を予約しますか？')) {
        // 予約データをバックエンドに送信する処理
        alert('予約が完了しました！');
    }
}

// 過去の研修一覧表示
function viewPastTrainings() {
    fetch('/past-trainings')
        .then(response => response.json())
        .then(data => {
            const trainingList = document.getElementById('training-list');
            trainingList.innerHTML = '';  // 一度リセット
            
            data.forEach(training => {
                const trainingItem = document.createElement('div');
                trainingItem.className = 'training-item';
                trainingItem.innerHTML = `<p>${training.name} - ${training.date} ${training.time}</p>`;
                trainingList.appendChild(trainingItem);
            });
        });
}
