std::vector<typename GraphType::Edge> search(size_t s, size_t g)
		{
			//std::cout << "serachfrom " << s << " to " << g << std::endl;
            start_id = s;
            goal_id  = g;
			openlist.clear();
            closedlist.clear();
            solution.clear();
            Heuristic heuristic;
            //heuristic from start to goal

            typename Heuristic::ReturnType h = heuristic( graph,graph.GetVertex(start_id),graph.GetVertex(goal_id) );
			Node<GraphType>* currentNode = nullptr;
			Node<GraphType>* newnode = new Node<GraphType>(s, nullptr, h, 0, true);
			openlist.push_back(newnode);
			openlistmap.insert(std::pair<size_t, Node<GraphType>*>(newnode->id, newnode));
			std::vector<typename GraphType::Edge> outedges;
			size_t outedges_size;
			typename Heuristic::ReturnType newh;
			while (openlist.size() > 0) {

				currentNode = openlist.front();
				std::pop_heap(openlist.begin(), openlist.end(), CompareNodes<GraphType>());
				openlist.pop_back();
				openlistmap.erase(currentNode->id);
				closedlist.insert(std::pair<size_t, Node<GraphType>*>(currentNode->id, currentNode));

				if (currentNode->id == g)
				{
					break;
				}

				outedges = graph.GetOutEdges(currentNode->id);
				outedges_size = outedges.size();
				for (size_t i = 0; i < outedges_size; ++i) {
					newh = heuristic(graph, graph.GetVertex(outedges[i].GetID2()), graph.GetVertex(goal_id));
					float newgiven = currentNode->given + outedges[i].GetWeight();
					float f = newgiven + newh;
					

					auto oitr = openlistmap.find(outedges[i].GetID2());
					

				
					if (oitr != openlistmap.end() && oitr->second->cost > f)
					{
						
						oitr->second->parent = currentNode;
						oitr->second->given = newgiven;
						oitr->second->cost = f;
						oitr->second->edgetohere = outedges[i];
						continue;
					}
					auto citr = closedlist.find(outedges[i].GetID2());
					if (citr != closedlist.end() && citr->second->cost > f)
					{
						closedlist.erase(citr);
						newnode = new Node<GraphType>(outedges[i].GetID2(), currentNode, f, newgiven, outedges[i]);
						openlist.push_back(newnode);
						std::push_heap(openlist.begin(), openlist.end(), CompareNodes<GraphType>());
						openlistmap.insert(std::pair<size_t, Node<GraphType>*>(newnode->id, newnode));
						continue;
					}
					if (oitr == openlistmap.end() && citr == closedlist.end())
					{
						newnode = new Node<GraphType>(outedges[i].GetID2(), currentNode, f, newgiven, outedges[i]);
						openlist.push_back(newnode);
						std::push_heap(openlist.begin(), openlist.end(), CompareNodes<GraphType>());
						openlistmap.insert(std::pair<size_t, Node<GraphType>*>(newnode->id, newnode));
					}

				}
			
			}


          
			while (!currentNode->isstart)
			{
				solution.push_back(currentNode->edgetohere);
				currentNode = currentNode->parent;
			}



            return solution;
        }