import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store';
import type { RootState } from '../../../store/reducers';

/**
 * Hooks Redux typés pour une utilisation sécurisée dans toute l'application
 * 
 * Utilisez ces hooks au lieu de useDispatch et useSelector standards
 * pour bénéficier de l'autocomplétion et de la vérification de types
 */

// Hook typé pour le dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook typé pour le selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
