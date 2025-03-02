from flask import Flask, render_template, request, jsonify
import csv
from datetime import datetime

app = Flask(__name__)

# Load events from CSV
def load_events_from_csv(file_path):
    events = []
    with open(file_path, mode="r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            events.append(row)
    return events

# Clean data
def clean_data(events):
    cleaned_events = []
    today = datetime.today()

    for event in events:
        event["title"] = event["title"].title()
        event["location"] = " ".join(event["location"].split())
        event_date = datetime.strptime(event["date"], "%Y-%m-%d")
        if event_date >= today:
            cleaned_events.append(event)

    return cleaned_events

# Search events
def search_events(events, keyword):
    return [event for event in events if keyword.lower() in event["title"].lower() or keyword.lower() in event["description"].lower()]

# Filter by category
def filter_by_category(events, category):
    return [event for event in events if event["category"].lower() == category.lower()]

# Count events by category
def count_events_by_category(events):
    category_count = {}
    for event in events:
        category = event["category"]
        category_count[category] = category_count.get(category, 0) + 1
    return category_count

# Homepage route
@app.route("/")
def home():
    return render_template("index.html")

# API route to get all events
@app.route("/events", methods=["GET"])
def get_all_events():
    events = load_events_from_csv("events.csv")
    cleaned_events = clean_data(events)
    return jsonify(cleaned_events)

# API route to search events
@app.route("/search", methods=["GET"])
def search():
    keyword = request.args.get("keyword", "")
    events = load_events_from_csv("events.csv")
    cleaned_events = clean_data(events)
    results = search_events(cleaned_events, keyword)
    return jsonify(results)

# API route to filter by category
@app.route("/filter", methods=["GET"])
def filter():
    category = request.args.get("category", "")
    events = load_events_from_csv("events.csv")
    cleaned_events = clean_data(events)
    results = filter_by_category(cleaned_events, category)
    return jsonify(results)

# API route to get category statistics
@app.route("/stats", methods=["GET"])
def stats():
    events = load_events_from_csv("events.csv")
    cleaned_events = clean_data(events)
    stats = count_events_by_category(cleaned_events)
    return jsonify(stats)
@app.route("/book", methods=["POST"])
def book_event():
    booking_data = request.get_json()

    # Save booking to a CSV file
    with open("bookings.csv", mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([
            booking_data["name"],
            booking_data["email"],
            booking_data["tickets"],
            booking_data["eventTitle"],
            booking_data["eventDate"],
        ])

    return jsonify({"message": "Booking successful!"}), 200

if __name__ == "__main__":
    app.run(debug=True)