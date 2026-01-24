<?php

// namespace App\Http\Controllers;

// use App\Models\Message;
// use Illuminate\Http\Request;

// class MessageController extends Controller
// {
//     public function page()
//     {
//         $messages = Message::orderBy('created_at')->get();
//         return view('chat', compact('messages'));
//     }

//     public function store(Request $request)
//     {
//         Message::create([
//             'sender_id' => 1, // sementara hardcode
//             'message' => $request->message,
//             'created_at' => now()
//         ]);

//         return redirect('/chat');
//     }

//     public function destroy($id)
//     {
//         Message::where('_id', $id)->delete();
//         return redirect('/chat');
//     }
// }

