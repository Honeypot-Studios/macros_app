import { supabase } from "./supabaseClient";

/*=======================================================*/
//  ToDo
//   - (Done) get fetchLib() to work
/*=======================================================*/

export const foodSearch = {
    fetchLib: async (userID, page = 0, pageSize = 15 ) => {
        //console.log('page and pageSize:', page, pageSize)
        const query = supabase
        .from('Food Library')
        .select('*')
        .range(page * pageSize, (page + 1) * pageSize - 1)

        return query
    }
}