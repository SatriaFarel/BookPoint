<?php

namespace App\Http\Controllers;

use App\Events\newMassage;
use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\Message;
use App\Events\NewMessage;
use App\Models\User;

class ChatController extends Controller
{
    public function chats($userId)
    {
        $chats = Chat::where('user_1', $userId)
            ->orWhere('user_2', $userId)
            ->get();

        return $chats->map(function ($chat) use ($userId) {
            $partnerId = $chat->user_1 == $userId
                ? $chat->user_2
                : $chat->user_1;

            $partner = User::select('id', 'name', 'foto', 'is_online')->find($partnerId);

            return [
                'id' => $chat->id,
                'partner' => $partner,
            ];
        });
    }


    public function messages($chatId)
    {
        return Message::where('chat_id', $chatId)
            ->orderBy('created_at')
            ->get(['id', 'sender_id', 'message', 'created_at']);
    }

    public function store(Request $request)
    {
        $message = Message::create([
            'chat_id' => $request->chat_id,
            'sender_id' => $request->sender_id,
            'message' => $request->message,
        ]);

        broadcast(new newMassage($message))->toOthers();

        return $message;
    }

    public function getOrCreateChat(Request $request)
    {
        $buyerId = $request->buyer_id;
        $sellerId = $request->seller_id;

        $chat = Chat::where(function ($q) use ($buyerId, $sellerId) {
            $q->where('user_1', $buyerId)
                ->where('user_2', $sellerId);
        })->orWhere(function ($q) use ($buyerId, $sellerId) {
            $q->where('user_1', $sellerId)
                ->where('user_2', $buyerId);
        })->first();

        if (!$chat) {
            $chat = Chat::create([
                'user_1' => $buyerId,
                'user_2' => $sellerId,
            ]);
        }

        return response()->json($chat);
    }
}
