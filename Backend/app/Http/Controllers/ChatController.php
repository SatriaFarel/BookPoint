<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\Message;
use App\Models\User;

class ChatController extends Controller
{
    /* ================= LIST CHAT USER ================= */
    public function chats($userId)
    {
        $chats = Chat::where('user_1', $userId)
            ->orWhere('user_2', $userId)
            ->latest()
            ->get();

        return response()->json(
            $chats->map(function ($chat) use ($userId) {

                $partnerId = $chat->user_1 == $userId
                    ? $chat->user_2
                    : $chat->user_1;

                $partner = User::select('id','name','foto')
                    ->find($partnerId);

                return [
                    'id' => $chat->id,
                    'partner' => $partner,
                ];
            })
        );
    }

    /* ================= GET MESSAGES ================= */
    public function messages($chatId)
    {
        $messages = Message::where('chat_id', $chatId)
            ->orderBy('created_at')
            ->get(['id','sender_id','message','created_at']);

        return response()->json($messages);
    }

    /* ================= SEND MESSAGE ================= */
    public function store(Request $request)
    {
        $request->validate([
            'chat_id'   => 'required|exists:chats,id',
            'sender_id' => 'required|exists:users,id',
            'message'   => 'required|string'
        ]);

        $message = Message::create([
            'chat_id'   => $request->chat_id,
            'sender_id' => $request->sender_id,
            'message'   => $request->message,
        ]);

        return response()->json($message);
    }

    /* ================= CREATE OR GET CHAT ================= */
    public function getOrCreateChat(Request $request)
    {
        $request->validate([
            'buyer_id'  => 'required|exists:users,id',
            'seller_id' => 'required|exists:users,id',
        ]);

        $buyerId  = $request->buyer_id;
        $sellerId = $request->seller_id;

        // Hindari chat dengan diri sendiri
        if ($buyerId == $sellerId) {
            return response()->json([
                'message' => 'Tidak bisa membuat chat dengan diri sendiri'
            ], 400);
        }

        $chat = Chat::where(function ($q) use ($buyerId, $sellerId) {
                $q->where('user_1', $buyerId)
                  ->where('user_2', $sellerId);
            })
            ->orWhere(function ($q) use ($buyerId, $sellerId) {
                $q->where('user_1', $sellerId)
                  ->where('user_2', $buyerId);
            })
            ->first();

        if (!$chat) {
            $chat = Chat::create([
                'user_1' => $buyerId,
                'user_2' => $sellerId,
            ]);
        }

        return response()->json($chat);
    }
}
