from bs4 import BeautifulSoup
import requests
from transformers import pipeline
from pymongo import MongoClient
from datetime import datetime

# Initialize sentiment analysis pipeline
pipe = pipeline("text-classification", model="yiyanghkust/finbert-tone")

# Initialize MongoDB client
client = MongoClient("mongodb+srv://geekzardsmait:4ww9lYzPrmhlw9Hn@media-matrix.oop9eml.mongodb.net/?retryWrites=true&w=majority&appName=media-matrix")
db = client["MM"]  # Use your database name here
collection = db["news"]  # Replace with your collection name

# Set of websites to scrape
websites = [
    {"name": "Sports", "url": "https://indianexpress.com/section/sports/"},
    {"name": "Political Pulse", "url": "https://indianexpress.com/section/political-pulse/"},
    {"name": "Lifestyle", "url": "https://indianexpress.com/section/lifestyle/"},
    {"name": "Entertainment", "url": "https://indianexpress.com/section/entertainment/"},
    {"name": "Business", "url": "https://indianexpress.com/section/business/"},
    {"name": "India", "url": "https://indianexpress.com/section/india/"}
]

def scrape_news(url):
    # Scrape news website and extract headlines, descriptions, and URLs
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    articles = []
    for article in soup.select(".articles"):
        headline = article.select_one(".img-context .title a").get_text()
        description = article.select_one(".img-context p").get_text()
        article_url = article.select_one(".img-context .title a")["href"]
        articles.append({"headline": headline, "description": description, "url": article_url})
    return articles

def analyze_sentiment(text):
    # Analyze sentiment of text using the sentiment analysis pipeline
    result = pipe(text)
    return result[0]

def store_article(article):
    # Store article in MongoDB
    collection.insert_one(article)

def main():
    for website in websites:
        new_articles = scrape_news(website["url"])
        for article in new_articles:
            existing_article = collection.find_one({"url": article["url"]})
            if existing_article is None:
                headline = article["headline"]
                description = article["description"]
                sentiment = analyze_sentiment(headline + " " + description)
                article["sentiment"] = 0 if sentiment['label'] == 'Neutral' else -1 if sentiment['label'] == 'Negative' else 1
                article["timestamp"] = datetime.now()
                article["department"]=website["name"]
                store_article(article)

if __name__ == "__main__":
    main()
