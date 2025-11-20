import json
from datetime import date, timedelta
import webview
import os

class API:
    def __init__(self):
        self.data_file = "data.json"
        self.daily_goal = 1800
        if not os.path.exists(self.data_file):
            with open(self.data_file, "w") as f:
                json.dump({"meals": [], "burned": []}, f)

    # --- Meals ---
    def add_meal(self, name, calories, meal_type):
        with open(self.data_file, "r") as f:
            data = json.load(f)
        data["meals"].append({
            "name": name,
            "calories": calories,
            "meal_type": meal_type,
            "date": str(date.today())
        })
        with open(self.data_file, "w") as f:
            json.dump(data, f, indent=4)
        return f"Meal '{name}' added successfully!"

    def get_daily_total(self):
        with open(self.data_file, "r") as f:
            data = json.load(f)
        today_str = str(date.today())
        return sum(m["calories"] for m in data["meals"] if m["date"] == today_str)

    def get_progress(self):
        total = self.get_daily_total()
        if total < self.daily_goal:
            return f"You are on track! You can still eat {self.daily_goal - total} kcal."
        elif total == self.daily_goal:
            return "Perfect! You've reached your daily goal."
        else:
            return f"Too much! You are {total - self.daily_goal} kcal over your goal."

    # --- Burned Calories ---
    def add_burned(self, activity, calories):
        with open(self.data_file, "r") as f:
            data = json.load(f)
        data["burned"].append({
            "activity": activity,
            "calories": calories,
            "date": str(date.today())
        })
        with open(self.data_file, "w") as f:
            json.dump(data, f, indent=4)
        return f"Added {calories} kcal burned for {activity}!"

    def get_net_calories(self):
        total_meals = self.get_daily_total()
        with open(self.data_file, "r") as f:
            data = json.load(f)
        today_str = str(date.today())
        total_burned = sum(b["calories"] for b in data["burned"] if b["date"] == today_str)
        return total_meals - total_burned

    # --- Weekly Summary ---
    def get_weekly_summary(self):
        with open(self.data_file, "r") as f:
            data = json.load(f)
        summary = []
        today = date.today()
        for i in range(7):
            day = today - timedelta(days=i)
            day_str = str(day)
            total_meals = sum(m["calories"] for m in data["meals"] if m["date"] == day_str)
            total_burned = sum(b["calories"] for b in data["burned"] if b["date"] == day_str)
            summary.append({"date": day_str, "net_calories": total_meals - total_burned})
        return summary[::-1]

    def get_daily_goal(self):
        return self.daily_goal

    def chat_bot(self, message):
        """
        Placeholder for AI response. For now, just echoes your message.
        We'll later connect it to a real AI model.
        """
        return f"You said: {message}"



# --- Start App ---
api = API()
webview.create_window("Calorie Tracker", "web/index.html", width=900, height=600, js_api=api)
webview.start()
