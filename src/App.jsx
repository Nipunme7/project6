import { useState, useEffect } from 'react'
import './App.css'

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
                <h2>{recipe.title}</h2>
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
  )
}

export default App
