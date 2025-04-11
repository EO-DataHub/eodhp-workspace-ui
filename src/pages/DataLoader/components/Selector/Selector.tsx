import React, { useEffect } from 'react';
import './styles.scss';

import type { Catalog } from 'stac-js';

import { Button } from '@/components/Button/Button';
import { useDataLoader } from '@/hooks/useDataLoader';

import { collectionPlaceholder } from '../../placeholders/collectionPlaceholder';

interface SelectorProps {
  catalogues: Catalog[];
}

const Selector = ({ catalogues }: SelectorProps) => {
  const {
    selectedCatalog,
    setSelectedCatalog,
    collections,
    setCollections,
    selectedCollection,
    setSelectedCollection,
  } = useDataLoader();

  useEffect(() => {
    onCatalogueSelect(catalogues[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogues]);

  const onCatalogueSelect = async (catalogId: string) => {
    const catalog = catalogues.filter((catalog) => catalog.id === catalogId)[0];
    setSelectedCatalog(catalog);

    // TODO: Warning message
    if (!catalog.links.length) return;

    const collectionLink = catalog.links.filter((link) => link.rel === 'collections')[0]?.href;

    if (import.meta.env.VITE_WORKSPACE_LOCAL) {
      setCollections(collectionPlaceholder.collections);
    } else {
      try {
        const res = await fetch(collectionLink);

        if (!res.ok) {
          // TODO: Display this error to the user
          throw new Error('Failed to fetch collections');
        }

        const json = await res.json();
        setCollections(json.collections);
        if (json.collections?.length) setSelectedCollection(json.collections[0]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onCollectionSelect = (collectionId: string) => {
    const collection = collections.filter((collection) => collection.id === collectionId)[0];
    setSelectedCollection(collection);
  };

  const renderCataloguesSelector = () => {
    if (!selectedCatalog) return;
    return (
      <div>
        <h3>Please select a Catalogue</h3>
        <select value={selectedCatalog.id} onChange={(e) => onCatalogueSelect(e.target.value)}>
          {catalogues.map((catalog) => {
            return (
              <option key={catalog.id} value={catalog.id}>
                {catalog.id}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const renderCollectionsContainer = () => {
    if (!selectedCatalog) return;
    if (!selectedCollection) return;
    return (
      <div className="selector-collections-container">
        <h3>Collections for {selectedCatalog.id}</h3>
        <div className="selector-collections">
          <select
            value={selectedCollection.id}
            onChange={(e) => onCollectionSelect(e.target.value)}
          >
            {collections?.map((collection) => {
              return (
                <option key={collection.id} value={collection.id}>
                  {collection.id}
                </option>
              );
            })}
          </select>
          <Button onClick={() => console.log('Clicked')}>Add new collection</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="data-loader__selector">
      {renderCataloguesSelector()}
      {renderCollectionsContainer()}
    </div>
  );
};

export default Selector;
