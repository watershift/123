
import os
import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, CallbackQueryHandler

API_URL = os.getenv("API_URL", "http://api:8000")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    welcome_text = (
        f"Привет, {user.first_name}! 🛡️\n"
        "Добро пожаловать в ваш персональный VPN менеджер.\n\n"
        "Здесь вы можете:\n"
        "— Проверить статус подписки\n"
        "— Скачать конфигурацию для WireGuard/Amnezia\n"
        "— Продлить доступ"
    )
    
    keyboard = [
        [InlineKeyboardButton("🚀 Подключить VPN", callback_data='get_config')],
        [InlineKeyboardButton("💳 Пополнить баланс", callback_data='billing')],
        [InlineKeyboardButton("⚙️ Поддержка", url='https://t.me/vpn_support')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(welcome_text, reply_markup=reply_markup)

async def handle_config(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    # In a real app, we verify session via API
    # requests.get(f"{API_URL}/api/vpn/provision?tg_id={query.from_user.id}")
    
    await query.edit_message_text(
        "⏳ Генерируем ваш уникальный конфиг...\nЭто займет пару секунд."
    )
    
    # Mocking config delivery
    await context.bot.send_document(
        chat_id=query.message.chat_id,
        document=open("template.conf", "rb"), # Provisioned via API
        filename="Amnezia_VPN.conf"
    )

if __name__ == '__main__':
    app = ApplicationBuilder().token(os.getenv("TELEGRAM_TOKEN")).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(handle_config, pattern='get_config'))
    app.run_polling()
