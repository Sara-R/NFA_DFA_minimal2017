function minimize(dfa,finals) {

	/*var dfa = [["0","1","4"],["1","4","2"],["2","0","2"],["3","5","4"],["4","-","3"],["5","4","2"]];
	var finals = ["2"];*/
	/*var dfa = [["a","b","c"],["b","a","d"],["c","e","f"],["d","e","f"],["e","e","f"],["f","f","f"]];
	var finals = ["c","d","e"];*/
	var nbr_alphabets = (dfa[0].length - 1) ;

	//Removing inaccessible nodes
	open = [dfa[0][0]];
	dfa2 = [];
	finals2 = [];
	index_node1 = -1;
	index_node2 = -1;
	while(open.length!=0)
	{
		node = open.shift();
		for(i=0;i<dfa.length;i++)
		{
			if(dfa[i][0]==node)
			{
				index_node1 = i;
				break;
			}
		}
		dfa2.push(dfa[index_node1]);
		//Check and push to final states array
		if(finals.indexOf(dfa[index_node1][0])!=(-1))
		{
			finals2.push(dfa[index_node1][0]);
		}
		for(k=1;k<=nbr_alphabets;k++)
		{
			exists = false;
			for(j=0;j<dfa2.length;j++)
			{
				if(dfa2[j][0]==dfa[index_node1][k])
				{
					exists = true;
					break;
				}
			}
			for(j=0;j<open.length;j++)
			{
				if(open[j]==dfa[index_node1][k])
				{
					exists = true;
					break;
				}
			}
			if(!exists)
			{
				index_node2 = -1;
				for(i=0;i<dfa.length;i++)
				{
					if(dfa[i][0]==dfa[index_node1][k])
					{
						index_node2 = i;
						break;
					}
				}
				if(index_node2!=(-1))
				{
					open.push(dfa[index_node2][0]);
				}
			}
		}
	}
	dfa = dfa2;
	finals = finals2;

	var grid = new Array(dfa.length);
	for(i=0;i<dfa.length;i++) //Modifying the length of rows
	{
		grid[i] = new Array(i);
	}
	
	for(i=1;i<grid.length;i++)
	{
		for(j=0;j<grid[i].length;j++)
		{
			if((finals.indexOf(dfa[i][0])!=-1 && finals.indexOf(dfa[j][0])==-1) || (finals.indexOf(dfa[j][0])!=-1 && finals.indexOf(dfa[i][0])==-1))
			{
				grid[i][j] = "*";
			}
		}
	}

	modified = true;
	while(modified)
	{
		modified = false;
		for(i=1;i<grid.length;i++)
		{
			for(j=0;j<grid[i].length;j++)
			{
				if(grid[i][j] != "*")
				{
					for(k=1;k<=nbr_alphabets;k++)
					{
						index_i = -1;
						index_j = -1;
						//alert(dfa[i][0] + " " + dfa[j][0] + " par alphabet:"+k + " donne : " +dfa[i][k] + " " + dfa[j][k]);
						for(l=0;l<dfa.length;l++)
						{
							if(dfa[l][0] == dfa[i][k])
							{
								index_i = l;
							}
							if(dfa[l][0] == dfa[j][k])
							{
								index_j = l;
							}
						}
						//alert(index_i + " " + index_j);
						//alert(grid[Math.max(index_i,index_j)][Math.min(index_i,index_j)]);
						if((((index_i==(-1)) && (index_j!=(-1))) || ((index_j==(-1)) && (index_i!=(-1)))) || (((index_j!=(-1)) && (index_i!=(-1))) && (grid[Math.max(index_i,index_j)][Math.min(index_i,index_j)] == "*")))
						{
							grid[i][j] = "*";
							modified = true;
							break;
						}
					}
				}
			}
		}
	}
	nbr_nodes = dfa.length;
	initial_class = -1;

	classes = [];
	for(i=1;i<grid.length;i++)
	{
		for(j=0;j<grid[i].length;j++)
		{
			if(grid[i][j]!="*")
			{
				added = false;
				for(k=0;k<classes.length;k++) // Check if i or j exist in a previous class
				{
					if(classes[k].indexOf(i)!=(-1))
					{
						if(j==0)
							initial_class = k;
						classes[k].push(j);
						added = true;
						break;
					}
					if(classes[k].indexOf(j)!=(-1))
					{
						if(i==0)
							initial_class = k;
						classes[k].push(i);
						added = true;
						break;
					}
				}
				if(!added)
				{
					if((j==0) || (i==0))
						initial_class = classes.length;
					classes.push([i,j]);
				}
				
			}
		}
	}
	nbr_classes = classes.length;

	//Indexes to strings in classes
	string_classes = [];
	for(i=0;i<classes.length;i++)
	{
		string_classes[i] = "";
		for(j=0;j<classes[i].length;j++)
		{
			string_classes[i] += dfa[classes[i][j]][0]+",";
		}
	}
	//Nodes with no equivalence class
	no_class = [];
	for(i=0;i<dfa.length;i++)
	{
		found = false;
		for(j=0;j<classes.length;j++)
		{
			if(classes[j].indexOf(i)!=-(1))
			{
				found = true;
				break;
			}
		}
		if(!found)
		{
			no_class.push(i);
		}
	}

	if(nbr_classes != nbr_nodes)
	{
		min_dfa = [];
		// Adding the initial node
		node_vector = [((initial_class!=(-1))? string_classes[initial_class]:dfa[0][0])];
		for(i=1;i<=nbr_alphabets;i++)
		{
			found = false;
			for(j=0;j<classes.length;j++)
			{
				index_node = -1;
				for(l=0;l<dfa.length;l++)
				{
					if(dfa[l][0]==dfa[0][i])
					{
						index_node = l;
						break;
					}
				}
				if(index_node!=(-1)  && classes[j].indexOf(index_node)!=(-1))
				{
					found = true;
					node_vector.push(string_classes[j]);
					break;
				}
			}
			if(!found)
			{
				node_vector.push(dfa[0][i]);
			}
		}
		min_dfa.push(node_vector);

		//Adding the other classes
		for(l=0;l<classes.length;l++)
		{
			if(l!=initial_class)
			{
				node_vector = [string_classes[l]];
				for(i=1;i<=nbr_alphabets;i++)
				{
					found = false;
					for(j=0;j<classes.length;j++)
					{
						index_node = -1;
						for(m=0;m<dfa.length;m++)
						{
							if(dfa[m][0]==dfa[classes[l][0]][i])
							{
								index_node = m;
								break;
							}
						}
						if(index_node!=(-1)  && classes[j].indexOf(m)!=(-1))
						{
							found = true;
							node_vector.push(string_classes[j]);
							break;
						}
					}
					if(!found)
					{
						node_vector.push(dfa[classes[l][0]][i]);
					}
				}
				min_dfa.push(node_vector);
			}
		}

		//Adding the nodes that don't belong to any class
		for(l=0;l<no_class.length;l++)
		{
			if(no_class[l]!=0)
			{
				node_vector = [dfa[no_class[l]][0]];
				for(i=1;i<=nbr_alphabets;i++)
				{
					found = false;
					for(j=0;j<classes.length;j++)
					{
						index_node = -1;
						for(m=0;m<dfa.length;m++)
						{
							if(dfa[m][0]==dfa[no_class[l]][i])
							{
								index_node = m;
								break;
							}
						}
						if(index_node!=(-1)  && classes[j].indexOf(m)!=(-1))
						{
							found = true;
							node_vector.push(string_classes[j]);
							break;
						}
					}
					if(!found)
					{
						node_vector.push(dfa[no_class[l]][i]);
					}
				}
				min_dfa.push(node_vector);
			}
			
		}
		
	}
	// New final states array
	min_finals = [];
	for(i=0;i<finals.length;i++)
	{
		for(j=0;j<dfa.length;j++)
		{
			if(dfa[j][0]==finals[i])
			{
				index_node = j;
				break;
			}
		}
		in_class = false;
		for(j=0;j<classes.length;j++)
		{
			if(classes[j].indexOf(index_node)!=(-1))
			{
				in_class = true;
				if(min_finals.indexOf(string_classes[j])==(-1))
				{
					min_finals.push(string_classes[j]);
				}
				break;
			}
		}
		if(!in_class)
		{
			if(min_finals.indexOf(dfa[index_node][0])==(-1))
			{
				min_finals.push(dfa[index_node][0]);
			}
		}
	}
	console.log(min_dfa);

    for (var i = 0; i < min_dfa.length; i++) {
    	for (var s= 0; s < min_dfa[i].length; s++) {
    		if(min_dfa[i][s].slice(-1)==",")
    		{
    			min_dfa[i][s] = min_dfa[i][s].slice(0, -1);
    		}
    	};
    };

    for (var i = 0; i < min_dfa.length; i++) {
     for (var j = 0; j < min_dfa[i].length; j++) {
          if(min_dfa[i][j]!="-")
         {  var res = min_dfa[i][j].split(',').map(function(item) {
                                                return parseInt(item, 10);
                                                     });
           res.sort();
           var sting=res.join(",");
           min_dfa[i][j]=sting;
          }
     };
   };
   console.log('after');

  console.log(min_dfa);
  var outterArray = [];
var existNodes=[];
for (var i = 0; i < min_dfa.length; i++) {
  if(existNodes.indexOf(min_dfa[i][0])==-1)
   {  existNodes.push(min_dfa[i][0]);
      outterArray.push(min_dfa[i]);
    }

};


	return min_dfa;
}