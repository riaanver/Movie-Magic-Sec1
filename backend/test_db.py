import psycopg2

# Connect to your database
conn = psycopg2.connect(
    dbname="movie_chatbot",
    user="khon",
    host="localhost",
    port="5432"
)

# Test query
cursor = conn.cursor()
cursor.execute("SELECT * FROM movies;")
movies = cursor.fetchall()

print(f"Found {len(movies)} movies!")
for movie in movies:
    print(f"- {movie[2]}")  # movie[2] is title

cursor.close()
conn.close()

