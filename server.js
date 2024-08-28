const express = require('express');
const app = express();
app.use(express.json());

let users = []; // ユーザー情報を格納する配列（例）
let trainings = []; // 研修情報を格納する配列（例）

// 研修の新規登録
app.post('/trainings', (req, res) => {
    const { name, date, day, time, maxParticipants, mandatoryForNew } = req.body;
    
    const newTraining = {
        id: `${name}-${date}`, // 一意のIDを生成するために使用
        name,
        date,
        day,
        time,
        maxParticipants,
        mandatoryForNew, // 新人講師出席必須の有無
        completedBy: [] // 参加者リスト
    };
    
    trainings.push(newTraining); // 研修リストに追加
    
    res.status(201).send('研修が正常に登録されました');
});

// 研修の修正
app.put('/trainings/:id', (req, res) => {
    const { id } = req.params;
    const { name, date, day, time, maxParticipants } = req.body;
    
    const training = trainings.find(t => t.id === id);
    if (training) {
        training.name = name || training.name;
        training.date = date || training.date;
        training.day = day || training.day;
        training.time = time || training.time;
        training.maxParticipants = maxParticipants || training.maxParticipants;

        res.status(200).send('研修情報が更新されました');
    } else {
        res.status(404).send('研修が見つかりません');
    }
});

// 研修予約確認と参加者一覧の取得
app.get('/trainings/:id/participants', (req, res) => {
    const { id } = req.params;
    
    const training = trainings.find(t => t.id === id);
    if (training) {
        res.status(200).json({
            name: training.name,
            date: training.date,
            day: training.day,
            time: training.time,
            maxParticipants: training.maxParticipants,
            participants: training.completedBy // 参加者一覧
        });
    } else {
        res.status(404).send('研修が見つかりません');
    }
});

// 研修参加者の削除
app.delete('/trainings/:id/participants/:participantId', (req, res) => {
    const { id, participantId } = req.params;
    
    const training = trainings.find(t => t.id === id);
    if (training) {
        training.completedBy = training.completedBy.filter(p => p !== participantId);
        res.status(200).send('参加者が削除されました');
    } else {
        res.status(404).send('研修が見つかりません');
    }
});

// 社員別研修参加状況の確認
app.get('/employees/:id/trainings', (req, res) => {
    const { id } = req.params;
    
    const userTrainings = trainings.filter(t => t.completedBy.includes(id));
    const upcomingTrainings = userTrainings.filter(t => new Date(t.date) > new Date());
    const pastTrainings = userTrainings.filter(t => new Date(t.date) <= new Date());

    res.status(200).json({
        upcomingTrainings,
        pastTrainings
    });
});

// 社員別研修状況のCSV出力
app.get('/employees/:id/trainings/csv', (req, res) => {
    const { id } = req.params;
    
    const userTrainings = trainings.filter(t => t.completedBy.includes(id));
    const fields = ['name', 'date', 'day', 'time'];
    const csv = new Parser({ fields }).parse(userTrainings);

    res.header('Content-Type', 'text/csv');
    res.attachment(`${id}_training_history.csv`);
    res.send(csv);
});

// 社員登録者の一覧確認
app.get('/employees', (req, res) => {
    const employeeList = users.map(user => ({
        name: user.name,
        email: user.email,
        joiningDate: user.joiningDate
    }));
    res.status(200).json(employeeList);
});

// 社員情報の修正
app.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, joiningDate } = req.body;

    const user = users.find(user => user.id === id);
    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.joiningDate = joiningDate || user.joiningDate;
        res.status(200).send('社員情報が更新されました');
    } else {
        res.status(404).send('社員が見つかりません');
    }
});

// 社員の削除
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;

    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        res.status(200).send('社員が削除されました');
    } else {
        res.status(404).send('社員が見つかりません');
    }
});

app.listen(3000, () => {
    console.log('サーバーが起動しました。ポート3000でリッスン中');
});
