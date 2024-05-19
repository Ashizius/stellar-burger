import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsInit
} from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const isIngredientsInit = useSelector(selectIngredientsInit);
  const param = useParams();
  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === param.id),
    [param.id, ingredients]
  );

  if (!ingredientData && !isIngredientsInit) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p>ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
