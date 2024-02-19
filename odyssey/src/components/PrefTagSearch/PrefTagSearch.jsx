import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Button, Form, Card } from 'react-bootstrap';
import './PrefTagSearch.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMinus, faTimes, faPlus, faTags, } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { hotelTags, breakfastRestaurantTags, lunchRestaurantTags, activityTags, dinnerRestaurantTags } from './tagsData';

/* 
PrefTagSearch Component
Props: 
- title: for the card's title
- onUpdate: callback function that gets triggered when selectedTags are updated. 
            this notifies the parent component when tags are updated.
            is called in the addTag and removeTag functions. 
*/
const PrefTagSearch = ({ title, onUpdate }) => {
    //initial state for tags in the searchbar
    const [tags, setTags] = useState([]);
    //initial state for tags that are selected/showing on the card component
    const [selectedTags, setSelectedTags] = useState([]);
    //initial state for hiding search bar. set to false
    const [searchVisible, setSearchVisible] = useState(false);

    useEffect(() => {
        //notify parent component when selected tags are updated: 
        onUpdate(title, selectedTags);
        setTags(getTagsDataForTitle(title));
    }, [title, selectedTags]);

    const getTagsDataForTitle = (title) => {
        switch (title) {
            case 'Hotel':
                return hotelTags;
            case 'Breakfast Restaurant':
                return breakfastRestaurantTags;
            case 'Lunch Restaurant':
                return lunchRestaurantTags;
            case 'Activity':
                return activityTags;
            case 'Dinner Restaurant':
                return dinnerRestaurantTags;
            default:
                return [];
        }
    }

    //set search bar to initial state (not visible): 
    const toggleSearch = () => {
        setSearchVisible(prevSearchVisible => !prevSearchVisible);
    };

    //function to add tags to the card component
    const addTag = (tag) => {
        // Check if tag object already exists in selectedTags
        if (!selectedTags.find(t => t.value === tag.value)) {
            // If not, add the entire tag object to selectedTags
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // function to remove tags from card 
    const removeTag = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    const saveTags = () => {
        toggleSearch();
    };

    return (
        <Card className='p-4 w-[600px]'>
            <Card.Title className="card-header" style={{ textAlign: 'left' }}>{title} Preferences</Card.Title>
            {searchVisible && (
                <div className="row-container">
                    <Select
                        options={tags}
                        onChange={selectedOption => addTag(selectedOption)}
                        isSearchable
                        placeholder="Select Search Filters"
                        styles={{
                            container: (base) => ({ ...base, flexGrow: 1, margin: '8px' }),
                          }}
                    />
                    <div style={{ backgroundColor: 'transparent' }}>
                        <Button className='button' onClick={saveTags}>Save</Button>
                    </div>
                </div>
            )}
            <div className='row-container'>
                <div className="selected-tags">
                    {selectedTags.map(tag => (
                        <span key={tag.value} className="tag">
                            {tag.label}
                            <FontAwesomeIcon icon={faTimes} onClick={() => removeTag(tag)} />
                        </span>
                    ))}
                </div>


                {!searchVisible ? (
                    <div className='add-filters-container' onClick={toggleSearch} >

                        <div className="tag">
                            <FontAwesomeIcon icon={faPlus} />
                            <FontAwesomeIcon icon={faTags} />
                        </div>
                    </div>
                ) : null}


            </div>


        </Card>
    )

}

export default PrefTagSearch;

