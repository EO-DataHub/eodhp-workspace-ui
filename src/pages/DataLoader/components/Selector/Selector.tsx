import React, { useEffect, useState } from 'react';
import './styles.scss';

import type { Catalog } from 'stac-js';

import { Button } from '@/components/Button/Button';
import { useDataLoader } from '@/hooks/useDataLoader';
import { useWorkspace } from '@/hooks/useWorkspace';

import { collectionTemplate } from './collectionTemplate';
import { collectionPlaceholder } from '../../placeholders/collectionPlaceholder';

interface SelectorProps {
  catalogues: Catalog[];
}

const Selector = ({ catalogues }: SelectorProps) => {
  const { activeWorkspace } = useWorkspace();
  const {
    selectedCatalog,
    setSelectedCatalog,
    collections,
    setCollections,
    selectedCollection,
    setSelectedCollection,
  } = useDataLoader();

  const [addingNewCollection, setAddingNewCollection] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');

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
      <div className="selector-catalogs">
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
    return (
      <div className="selector-collections-container">
        <h3>Collections for {selectedCatalog.id}</h3>
        <div className="selector-collections">
          {selectedCollection && (
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
          )}
          <Button
            onClick={() => {
              setAddingNewCollection(true);
            }}
          >
            Add new collection
          </Button>
        </div>
      </div>
    );
  };

  const renderAddNewCollection = () => {
    return (
      <div className="selector-collections-new">
        <div className="selector-collections-new__input">
          <label htmlFor="new-collection-name">Collection name</label>
          <input
            id="new-collection-name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
        </div>
        <div className="selector-collections-new__buttons">
          <Button disabled={!newCollectionName} onClick={() => addNewCollection()}>
            Add new collection
          </Button>
          <Button onClick={() => setAddingNewCollection(false)}>Cancel</Button>
        </div>
      </div>
    );
  };

  const addNewCollection = async () => {
    const newTemplate = { ...collectionTemplate };
    newTemplate.id = newCollectionName;
    newTemplate.links[0].href = `https://${window.location.hostname}/api/catalogue/stac/catalogs/user/catalogs/${activeWorkspace.name}/catalogs/${selectedCatalog.id}/collections/${newTemplate.id}`;

    try {
      const body = {
        fileContent: JSON.stringify(newTemplate),
        fileName: `${newTemplate.id}.json`,
      };

      const res = await fetch(`/api/workspaces/${activeWorkspace.name}/data-loader`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error();
      }

      try {
        await fetch(`/workspaces/${activeWorkspace.name}/harvest`, { method: 'POST' });
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="selector">
      {renderCataloguesSelector()}
      {renderCollectionsContainer()}
      {addingNewCollection && renderAddNewCollection()}
    </div>
  );
};

export default Selector;
