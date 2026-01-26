import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../data/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export function useWatchAndLearn() {
    const [units, setUnits] = useState([]);
    const [categories, setCategories] = useState([]); // Add categories state
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            // Fetch Units
            const { data: unitsData, error: unitError } = await supabase
                .from('units')
                .select('*')
                .order('order', { ascending: true });

            if (unitError) throw unitError;

            // Fetch Lessons
            const { data: lessonsData, error: lessonError } = await supabase
                .from('lessons')
                .select('*')
                .order('order', { ascending: true });

            if (lessonError) throw lessonError;

            // Fetch Versions
            const { data: versionsData, error: versionError } = await supabase
                .from('lesson_versions')
                .select('*');

            if (versionError) throw versionError;

            // Fetch Checkpoints
            const { data: checkpointsData, error: cpError } = await supabase
                .from('checkpoints')
                .select('*')
                .order('time_sec', { ascending: true });

            if (cpError) throw cpError;

            // Fetch Categories (New)
            const { data: categoriesData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (catError) throw catError;

            // Assemble Data Structure: Unit -> Lessons -> Version -> Checkpoints
            const assembledUnits = unitsData.map(unit => {
                const unitLessons = lessonsData.filter(l => l.unit_id === unit.id).map(lesson => {
                    // Find active version (or latest)
                    let version = versionsData.find(v => v.id === lesson.current_version_id);
                    if (!version) {
                        // Fallback: find any version for this lesson
                        version = versionsData.find(v => v.lesson_id === lesson.id);
                    }

                    if (version) {
                        version.checkpoints = checkpointsData
                            .filter(cp => cp.lesson_version_id === version.id)
                            .map(cp => ({
                                ...cp,
                                timeSec: cp.time_sec, // Map snake_case to camelCase
                                vocabId: cp.vocab_id   // Map snake_case to camelCase
                            }));
                    }

                    const getDifficultyLevel = (val) => {
                        switch (val) {
                            case 1: return 'Beginner';
                            case 2: return 'Intermediate';
                            case 3: return 'Advanced';
                            case 4: return 'Professional';
                            default: return 'Intermediate';
                        }
                    };

                    return {
                        ...lesson,
                        durationSec: version?.duration_sec || 0,
                        videoUrl: version?.video_url || '',
                        difficultyLevel: getDifficultyLevel(version?.difficulty), // Map Int -> String
                        vocab_ids: version?.vocab_ids || [], // Pass IDs
                        version: version || { checkpoints: [] }
                    };
                });

                const category = categoriesData?.find(c => c.id === unit.category_id);
                return {
                    ...unit,
                    categoryName: category?.name || 'Unknown', // Map for UI
                    categoryColor: category?.color_code,
                    lessons: unitLessons
                };
            });

            setUnits(assembledUnits);
            setCategories(categoriesData || []); // Set categories state


        } catch (err) {
            console.error("Error loading Watch & Learn data:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);


    // --- UNIT ACTIONS ---
    const createUnit = async (unitData) => {
        const newUnit = {
            id: uuidv4(),
            title: unitData.title,
            description: unitData.description,
            order: units.length + 1,
            status: 'draft',
            category_id: unitData.category_id // Dynamic Category ID
        };

        const { error } = await supabase.from('units').insert([newUnit]);
        if (!error) {
            setUnits(prev => [...prev, { ...newUnit, lessons: [] }]);
        }
    };

    const updateUnit = async (unitId, updates) => {
        const { error } = await supabase.from('units').update(updates).eq('id', unitId);
        if (!error) {
            setUnits(prev => prev.map(u => u.id === unitId ? { ...u, ...updates } : u));
        }
        return { success: !error, error };
    };

    const deleteUnit = async (id) => {
        const { error } = await supabase.from('units').delete().eq('id', id);
        if (!error) {
            setUnits(prev => prev.filter(u => u.id !== id));
        }
    };

    // --- LESSON ACTIONS ---
    const addLesson = async (unitId, lessonData) => {
        const lessonId = uuidv4();
        const versionId = uuidv4();

        // 1. Create Lesson
        const { error: lError } = await supabase.from('lessons').insert([{
            id: lessonId,
            unit_id: unitId,
            title: lessonData.title,
            description: lessonData.description,
            order: (units.find(u => u.id === unitId)?.lessons?.length || 0) + 1, // Dynamic Order
            current_version_id: versionId
        }]);

        if (lError) return;

        // 2. Create Version
        const { error: vError } = await supabase.from('lesson_versions').insert([{
            id: versionId,
            lesson_id: lessonId,
            version_number: 1,
            status: 'draft',
            video_url: '',
            duration_sec: 0
        }]);

        if (!vError) {
            setUnits(prev => prev.map(u => {
                if (u.id !== unitId) return u;
                // Create new lesson object structure matching loadData
                const newLesson = {
                    id: lessonId,
                    unit_id: unitId,
                    title: lessonData.title,
                    description: lessonData.description,
                    order: 99,
                    current_version_id: versionId,
                    durationSec: 0,
                    videoUrl: '',
                    version: {
                        id: versionId,
                        lesson_id: lessonId,
                        version_number: 1,
                        status: 'draft',
                        video_url: '',
                        duration_sec: 0,
                        checkpoints: []
                    }
                };
                return { ...u, lessons: [...(u.lessons || []), newLesson] };
            }));
        }
    };

    const updateLesson = async (unitId, lessonId, updates) => {
        const { error } = await supabase.from('lessons').update(updates).eq('id', lessonId);
        if (!error) {
            setUnits(prev => prev.map(u => {
                if (u.id !== unitId) return u;
                return {
                    ...u,
                    lessons: u.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
                };
            }));
        }
        return { success: !error, error };
    };

    const updateLessonVersion = async (versionId, updates) => {
        // updates: { video_url, difficulty, duration_sec, status, vocab_ids }
        console.log(`[useWatchAndLearn] Updating version ${versionId}:`, updates);
        const { data, error } = await supabase
            .from('lesson_versions')
            .update(updates)
            .eq('id', versionId)
            .select();

        if (error) {
            console.error("[useWatchAndLearn] Update version FAILED:", error);
        } else {
            console.log("[useWatchAndLearn] Update version SUCCESS:", data);
            // Update local state by finding the unit > lesson > version
            setUnits(prev => prev.map(u => ({
                ...u,
                lessons: u.lessons.map(l => {
                    if (l.version?.id === versionId) {
                        return {
                            ...l,
                            videoUrl: updates.video_url !== undefined ? updates.video_url : l.videoUrl,
                            durationSec: updates.duration_sec !== undefined ? updates.duration_sec : l.durationSec,
                            // If difficulty update, also update difficultyLevel (optional optimization, or let reload handle it)
                            difficultyLevel: updates.difficulty ? (
                                updates.difficulty === 1 ? 'Beginner' :
                                    updates.difficulty === 2 ? 'Intermediate' :
                                        updates.difficulty === 3 ? 'Advanced' : 'Professional'
                            ) : l.difficultyLevel,
                            vocab_ids: updates.vocab_ids !== undefined ? updates.vocab_ids : l.vocab_ids,
                            version: { ...l.version, ...updates }
                        };
                    }
                    return l;
                })
            })));
        }
        return { success: !error, error, data };
    };

    const deleteLesson = async (unitId, lessonId) => {
        // Cascade delete should handle children if configured in DB.
        // If not, we typically blindly delete lesson and trust DB or delete children first.
        // Assuming Postgres ON DELETE CASCADE is set up in my seed script:
        // CREATE TABLE IF NOT EXISTS lessons (... references units(id) ON DELETE CASCADE)
        // CREATE TABLE IF NOT EXISTS lesson_versions (... references lessons(id) ON DELETE CASCADE)
        // So deleting lesson is enough.
        const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
        if (!error) {
            setUnits(prev => prev.map(u => {
                if (u.id !== unitId) return u;
                return { ...u, lessons: u.lessons.filter(l => l.id !== lessonId) };
            }));
        }
        return { success: !error, error };
    };

    // --- CHECKPOINT ACTIONS ---
    const saveCheckpoints = async (unitId, lessonId, checkpoints) => {
        try {
            // Find version ID first
            const unit = units.find(u => u.id === unitId);
            const lesson = unit?.lessons.find(l => l.id === lessonId);
            const versionId = lesson?.version?.id;

            if (!versionId) throw new Error("No version ID found");

            // 1. Delete existing (simple replace strategy for MVP)
            const { error: delError } = await supabase.from('checkpoints').delete().eq('lesson_version_id', versionId);
            if (delError) throw delError;

            // 2. Insert new
            const toInsert = checkpoints.map(cp => ({
                id: cp.id.includes('cp_') ? uuidv4() : cp.id, // Generate real UUID if it was temp
                lesson_version_id: versionId,
                time_sec: cp.timeSec,
                type: cp.type,
                vocab_id: cp.vocabId || null,
                content: cp.content
            }));

            if (toInsert.length > 0) {
                const { error: insError } = await supabase.from('checkpoints').insert(toInsert);
                if (insError) throw insError;
            }

            // Reload data to sync state
            await loadData(true);
            return { success: true };
        } catch (error) {
            console.error("Save checkpoints error:", error);
            return { success: false, error };
        }
    };

    return {
        units,
        isLoading,
        createUnit,
        updateUnit,
        deleteUnit,
        addLesson,
        updateLesson,
        updateLessonVersion,
        updateLessonVersion,
        deleteLesson,
        saveCheckpoints,
        categories, // Export categories
        refreshData: loadData // Export refresh capability
    };
}
