/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import './styles.scss';

import type { Catalog } from 'stac-js';

import Refresh from '@/assets/icons/refresh.svg';
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
    setMessage,
  } = useDataLoader();

  const [addingNewCollection, setAddingNewCollection] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    onCatalogueSelect(catalogues[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogues]);

  const refresh = () => {
    onCatalogueSelect(selectedCatalog.id);
  };

  const onCatalogueSelect = async (catalogId: string) => {
    setSelectedCollection(null);
    const catalog = catalogues.filter((catalog) => catalog.id === catalogId)[0];
    setSelectedCatalog(catalog);

    // TODO: Warning message
    if (!catalog.links.length) return;

    const collectionLink = catalog.links.filter((link) => link.rel === 'collections')[0]?.href;

    if (import.meta.env.VITE_WORKSPACE_LOCAL) {
      setCollections(collectionPlaceholder.collections);
      setSelectedCollection(collectionPlaceholder.collections[0]);
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
            const selfLink = catalog.links.filter((link) => {
              return link.rel === 'self';
            })[0];
            const id = selfLink.href.split(`${activeWorkspace.name}/`)[1];
            return (
              <option key={id} value={id}>
                {id}
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
          {selectedCollection && collections.length && (
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
          {!addingNewCollection && (
            <Button
              onClick={() => {
                setAddingNewCollection(true);
              }}
            >
              Add new collection
            </Button>
          )}
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
          <Button disabled={!newCollectionName || adding} onClick={() => addNewCollection()}>
            Add new collection
          </Button>
          <Button onClick={() => setAddingNewCollection(false)}>Cancel</Button>
        </div>
      </div>
    );
  };

  const addNewCollection = async () => {
    setAdding(true);
    const newTemplate = { ...collectionTemplate };
    newTemplate.id = newCollectionName;
    newTemplate.links[0].href = `https://${window.location.hostname}/api/catalogue/stac/catalogs/user/catalogs/${activeWorkspace.name}/catalogs/${selectedCatalog.id}/collections/${newTemplate.id}`;
    newTemplate.links[1].href = `catalogs/${selectedCatalog.id}`;

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
        throw new Error('Failed to upload access policy');
      }

      const harvestRes = await fetch(`/workspaces/${activeWorkspace.name}/harvest`, {
        method: 'POST',
      });
      if (!harvestRes.ok) {
        throw new Error('Failed to load data');
      }
      setMessage('Collection successfully uploaded, please check back later to view collection');
      setAddingNewCollection(false);
    } catch (error) {
      setMessage(error.message);
    }
    setAdding(false);
  };

  const renderViewSTACButtons = () => {
    const buttons = [];

    if (selectedCatalog) {
      buttons.push(
        <Button
          onClick={() =>
            window.open(
              `https://${window.location.hostname}/api/catalogue/stac/catalogs/user/catalogs/${activeWorkspace.name}/catalogs/${selectedCatalog.id}`,
              '_blank',
            )
          }
        >
          View {selectedCatalog.id} catalog data
        </Button>,
      );
    }
    if (selectedCollection) {
      buttons.push(
        <Button
          onClick={() =>
            window.open(
              `https://${window.location.hostname}/api/catalogue/stac/catalogs/user/catalogs/${activeWorkspace.name}/catalogs/${selectedCatalog.id}/collections/${selectedCollection.id}`,
              '_blank',
            )
          }
        >
          View {selectedCollection.id} collection data
        </Button>,
      );
      buttons.push(
        <Button
          onClick={() =>
            window.open(
              `https://${window.location.hostname}/api/catalogue/stac/catalogs/user/catalogs/${activeWorkspace.name}/catalogs/${selectedCatalog.id}/collections/${selectedCollection.id}/items`,
              '_blank',
            )
          }
        >
          View {selectedCollection.id} item data
        </Button>,
      );
    }

    return <div className="selector-collections__buttons">{buttons}</div>;
  };

  return (
    <div className="selector">
      <img alt="refresh" src={Refresh} onClick={() => refresh()} />
      {renderCataloguesSelector()}
      {renderCollectionsContainer()}
      {addingNewCollection && renderAddNewCollection()}
      {renderViewSTACButtons()}
    </div>
  );
};

export default Selector;
