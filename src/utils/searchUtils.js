import { supabase } from "./supabaseClient";

/*=======================================================*/
//  ToDo
//      - Do some shit
//      - Search bar function?
/*=======================================================*/

export const foodSearch = {
    fetchLib: (userID, page = 0, pageSize = 15 ) => {
        
        const query = supabase
        .from('Food Library')
        .select('*')
        .range(page * pageSize, (page + 1) * pageSize - 1)

        return query
    }
}