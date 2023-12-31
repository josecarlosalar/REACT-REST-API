import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from './api';
import { createEmptyCharacter, Character } from './character.vm';
import { mapHotelFromApiToVm, mapHotelFromVmToApi } from './character.mappers';
import { Lookup } from 'common/models';
import { CharacterComponent } from './character.component';

export const CharacterContainer: React.FunctionComponent = (props) => {
  const [hotel, setHotel] = React.useState<Character>(createEmptyCharacter());
  const [cities, setCities] = React.useState<Lookup[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleLoadCityCollection = async () => {
    const apiCities = await api.getCities();
    setCities(apiCities);
  };

  const handleLoadHotel = async () => {
    const apiHotel = await api.getHotel(id);
    setHotel(mapHotelFromApiToVm(apiHotel));
  };

  React.useEffect(() => {
    if (id) {
      handleLoadHotel();
    }
    handleLoadCityCollection();
  }, []);

  const handleSave = async (hotel: Character) => {
    const apiHotel = mapHotelFromVmToApi(hotel);
    const success = await api.saveHotel(apiHotel);
    if (success) {
      navigate(-1);
    } else {
      alert('Error on save hotel');
    }
  };

  return <CharacterComponent hotel={hotel} cities={cities} onSave={handleSave} />;
};
