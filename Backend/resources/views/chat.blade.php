<!DOCTYPE html>
<html>
<head>
    <title>Chat Simple</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        .chat-box { border: 1px solid #ccc; padding: 10px; max-width: 400px; }
        .msg { margin-bottom: 5px; }
        form { margin-top: 10px; }
    </style>
</head>
<body>

<h3>Chat Simple (Mongo)</h3>

<div class="chat-box">
    @foreach ($messages as $msg)
        <div class="msg">
            {{ $msg->message }}
            <form action="/chat/delete/{{ $msg->_id }}" method="POST" style="display:inline;">
                @csrf
                <button type="submit">x</button>
            </form>
        </div>
    @endforeach
</div>

<form action="/chat" method="POST">
    @csrf
    <input type="text" name="message" placeholder="Ketik pesan..." required>
    <button type="submit">Kirim</button>
</form>

</body>
</html>
