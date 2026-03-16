# jogo_ia/app.py
from flask import Flask, render_template, request, jsonify
import heapq
from collections import deque

app = Flask(__name__)

rows = 10
cols = 10

def heuristica(a, b):
    return abs(a[0]-b[0]) + abs(a[1]-b[1])

def astar(grid, start, end):
    open_list = []
    heapq.heappush(open_list, (0, start))
    came_from = {}
    g_score = {start: 0}
    visited = set()
    nodes_explored = 0

    while open_list:
        _, current = heapq.heappop(open_list)
        nodes_explored += 1

        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path, nodes_explored

        visited.add(current)
        x, y = current
        moves = [(1,0),(-1,0),(0,1),(0,-1)]

        for dx, dy in moves:
            nx, ny = x + dx, y + dy
            neighbor = (nx, ny)

            if not (0 <= nx < rows and 0 <= ny < cols):
                continue
            if grid[nx][ny] == 1:
                continue

            tentative_g = g_score[current] + 1

            if neighbor in visited and tentative_g >= g_score.get(neighbor, float("inf")):
                continue

            if tentative_g < g_score.get(neighbor, float("inf")):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score = tentative_g + heuristica(neighbor, end)
                heapq.heappush(open_list, (f_score, neighbor))

    return [], nodes_explored

def bfs(grid, start, end):
    queue = deque([start])
    visited = {start}
    came_from = {}
    nodes_explored = 0

    while queue:
        current = queue.popleft()
        nodes_explored += 1

        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path, nodes_explored

        x, y = current
        moves = [(1,0),(-1,0),(0,1),(0,-1)]

        for dx, dy in moves:
            nx, ny = x + dx, y + dy
            neighbor = (nx, ny)

            if not (0 <= nx < rows and 0 <= ny < cols):
                continue
            if grid[nx][ny] == 1:
                continue

            if neighbor not in visited:
                visited.add(neighbor)
                came_from[neighbor] = current
                queue.append(neighbor)

    return [], nodes_explored

@app.route("/")
def home():
    return render_template("menu.html")

@app.route("/robo")
def robo():
    return render_template("robo.html")

@app.route("/velha")
def velha():
    return render_template("velha.html")

@app.route("/resolver", methods=["POST"])
def resolver():
    data = request.json
    grid = data["grid"]
    start = (0,0)
    end = (9,9)

    path_astar, nodes_astar = astar(grid, start, end)
    path_bfs, nodes_bfs = bfs(grid, start, end)

    return jsonify({
        "astar": path_astar,
        "bfs": path_bfs,
        "nodes_astar": nodes_astar,
        "nodes_bfs": nodes_bfs
    })

if __name__ == "__main__":
    app.run(debug=True)