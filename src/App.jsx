import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

function Dashboard({ recipes, filteredRecipes, loading, error, searchQuery, handleSearchChange, dietFilter, handleFilterChange, stats }) {
  // Chart data preparation
  const dietData = [
    { name: 'Vegetarian', value: recipes.filter(recipe => recipe.vegetarian).length },
    { name: 'Vegan', value: recipes.filter(recipe => recipe.vegan).length },
    { name: 'Gluten Free', value: recipes.filter(recipe => recipe.glutenFree).length },
    { name: 'Other', value: recipes.filter(recipe => !recipe.vegetarian && !recipe.vegan && !recipe.glutenFree).length }
  ];

  const timeData = recipes.slice(0, 10).map(recipe => ({
    name: recipe.title.length > 15 ? recipe.title.substring(0, 15) + '...' : recipe.title,
    time: recipe.readyInMinutes
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app-container">
      <header>
        <h1>Recipe Explorer</h1>
        <div className="stats-container">
          <div className="stat-box">
            <h3>Total Recipes</h3>
            <p>{stats.totalRecipes}</p>
          </div>
          <div className="stat-box">
            <h3>Avg. Preparation Time</h3>
            <p>{stats.avgTime} minutes</p>
          </div>
          <div className="stat-box">
            <h3>Avg. Health Score</h3>
            <p>{stats.avgScore}/100</p>
          </div>
        </div>
      </header>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Recipe Diet Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dietData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dietData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box">
          <h3>Preparation Time (Top 10 Recipes)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#ff6b6b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <label htmlFor="diet-filter">Filter diet:</label>
          <select
            id="diet-filter"
            value={dietFilter}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="glutenFree">Gluten Free</option>
          </select>
        </div>
      </div>

      <div className="recipes-container">
        {filteredRecipes.length === 0 ? (
          <p className="no-results">No recipes found matching your criteria</p>
        ) : (
          filteredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} className="recipe-image" />
              <div className="recipe-info">
                <h2>
                  <Link to={`/recipe/${recipe.id}`} className="recipe-link">
                    {recipe.title}
                  </Link>
                </h2>
                <div className="recipe-details">
                  <p><strong>Ready in:</strong> {recipe.readyInMinutes} minutes</p>
                  <p><strong>Health Score:</strong> {recipe.healthScore}/100</p>
                  <div className="diet-tags">
                    {recipe.vegetarian && <span className="diet-tag vegetarian">Vegetarian</span>}
                    {recipe.vegan && <span className="diet-tag vegan">Vegan</span>}
                    {recipe.glutenFree && <span className="diet-tag gluten-free">Gluten Free</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RecipeDetail({ recipes, loading, error }) {
  const { id } = useParams();
  const recipeId = parseInt(id);

  if (loading) return <div className="loading">Loading recipe details...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const recipe = recipes.find(r => r.id === recipeId);

  if (!recipe) return <div className="error">Recipe not found</div>;

  return (
    <div className="app-container">
      <header>
        <h1>Recipe Explorer</h1>
        <div className="back-link">
          <Link to="/">← Back to Recipes</Link>
        </div>
      </header>

      <div className="recipe-detail">
        <div className="recipe-detail-header">
          <h2>{recipe.title}</h2>
          <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />
        </div>

        <div className="recipe-detail-info">
          <div className="recipe-detail-meta">
            <div className="detail-box">
              <h3>Preparation Time</h3>
              <p>{recipe.readyInMinutes} minutes</p>
            </div>
            <div className="detail-box">
              <h3>Health Score</h3>
              <p>{recipe.healthScore}/100</p>
            </div>
            <div className="detail-box">
              <h3>Servings</h3>
              <p>{recipe.servings}</p>
            </div>
          </div>

          <div className="recipe-detail-tags">
            {recipe.vegetarian && <span className="diet-tag vegetarian">Vegetarian</span>}
            {recipe.vegan && <span className="diet-tag vegan">Vegan</span>}
            {recipe.glutenFree && <span className="diet-tag gluten-free">Gluten Free</span>}
            {recipe.dairyFree && <span className="diet-tag dairy-free">Dairy Free</span>}
          </div>

          <div className="recipe-detail-summary">
            <h3>Summary</h3>
            <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
          </div>

          {recipe.instructions && (
            <div className="recipe-detail-instructions">
              <h3>Instructions</h3>
              <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all');

  const API_KEY = 'a2000a07fbc34225bbef353242d1a29d';

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=30&addRecipeInformation=true`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        setRecipes(data.results);
        setFilteredRecipes(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = dietFilter === 'all' ||
        (dietFilter === 'vegetarian' && recipe.vegetarian) ||
        (dietFilter === 'vegan' && recipe.vegan) ||
        (dietFilter === 'glutenFree' && recipe.glutenFree);

      return matchesSearch && matchesFilter;
    });

    setFilteredRecipes(filtered);
  }, [searchQuery, dietFilter, recipes]);

  const calculateStats = () => {
    if (recipes.length === 0) return { avgTime: 0, avgScore: 0, totalRecipes: 0 };

    const totalRecipes = recipes.length;
    const avgTime = Math.round(recipes.reduce((sum, recipe) => sum + recipe.readyInMinutes, 0) / totalRecipes);
    const avgScore = Math.round(recipes.reduce((sum, recipe) => sum + recipe.healthScore, 0) / totalRecipes);

    return { avgTime, avgScore, totalRecipes };
  };

  const stats = calculateStats();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setDietFilter(event.target.value);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Dashboard
            recipes={recipes}
            filteredRecipes={filteredRecipes}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            dietFilter={dietFilter}
            handleFilterChange={handleFilterChange}
            stats={stats}
          />
        } />
        <Route path="/recipe/:id" element={
          <RecipeDetail
            recipes={recipes}
            loading={loading}
            error={error}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App
